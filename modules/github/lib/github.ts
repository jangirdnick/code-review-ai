import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import { headers } from "next/headers"
import { Octokit } from "octokit"

/* -------------------- GET GITHUB TOKEN -------------------- */

export const getGithubToken = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  const account = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "github",
    },
  })

  if (!account?.accessToken) {
    throw new Error("GitHub access token not found")
  }

  return account.accessToken
}

/* -------------------- GET GITHUB CLIENT -------------------- */

export const getGithubClient = async () => {
  const token = await getGithubToken()

  const octokit = new Octokit({ auth: token })
  const { data: user } = await octokit.rest.users.getAuthenticated()

  return {
    octokit,
    user,
    token,
  }
}

/* -------------------- FETCH CONTRIBUTION CALENDAR -------------------- */

export async function fetchUserContribution(token: string) {
  const octokit = new Octokit({ auth: token })

  const query = `
  query {
    viewer {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              color
            }
          }
        }
      }
    }
  }
  `

  interface ContributionData {
    viewer: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number
          weeks: {
            contributionDays: {
              contributionCount: number
              date: string
              color: string
            }[]
          }[]
        }
      }
    }
  }

  try {
    const response = await octokit.graphql<ContributionData>(query)

    return response.viewer.contributionsCollection.contributionCalendar
  } catch (error) {
    console.error("GitHub GraphQL Error:", error)
    throw new Error("Failed to fetch contributions")
  }
}


export const createWebHook = async (owner: string, repo: string) => {
  const token = await getGithubToken();
  const octokit = new Octokit({auth: token})

  const webhookURL = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/webhooks/github`

  const {data:hooks} = await octokit.rest.repos.listWebhooks({
    owner,
    repo
  })

  const existingHook = hooks.find(hook=> hook.config.url === webhookURL);
  if(existingHook) return existingHook

  const {data} = await octokit.rest.repos.createWebhook({
    owner,
    repo,
    config: {
      url: webhookURL,
      content_type: "json"
    },
    events: ["pull_request"]
  })

  return data;
}

export const deleteWebHook = async (owner: string, repo: string) => {
  const token = await getGithubToken()
  const octokit = new Octokit({auth: token})

  const webhookURL = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/webhooks/github`

  try {
    
    const {data: hooks} = await octokit.rest.repos.listWebhooks({
      owner, repo
    })

    const hookToDelete = hooks.find(hook => hook.config.url === webhookURL);
    if(hookToDelete){
      await octokit.rest.repos.deleteWebhook({
        owner, repo, hook_id: hookToDelete.id
      })

      return true;
    }

    return false

  } catch (error) {
    console.error("Error deleting webhook: ", error)
    return false;
  }
}

export const getRepoFileContents = async (
  token: string, owner: string, 
  repo: string, path: string = "",
): Promise<{path: string; content: string}[]> => {
  const octokit = new Octokit({ auth: token })

  const {data} = await octokit.rest.repos.getContent({
    owner, repo, path
  })

  if(!Array.isArray(data)){
    if(data.type === "file" && data.content) return [{
      path: data.path,
      content: Buffer.from(data.content, "base64").toString("utf-8")
    }]

    return [];
  }

  let files: {path: string, content: string}[] = []

  for(const item of data){
    if(item.type === "file"){
      const {data: fileData} = await octokit.rest.repos.getContent({
        owner, repo, path: item.path
      })

      if(!Array.isArray(fileData) && fileData.type === "file" && fileData.content){
        if(!item.path.match(/\.(png|jpg|jpeg|gif|svg|icon|pdf|zip|tar|gz)$/i)) {
          files.push({
            path: item.path,
            content: Buffer.from(fileData.content, "base64").toString("utf-8")
          })
        }
      }
    }

    else if (item.type === "dir") {
      const subFiles = await getRepoFileContents(token, owner, repo, item.path)

      files = files.concat(subFiles)
    }
  }

  return files
}