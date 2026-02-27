import prisma from "@/lib/db";
import { inngest } from "./client";
import { getRepoFileContents } from "@/modules/github/lib/github";
import { indexCodebase } from "@/modules/ai/lib/rag";

export const indexRepo = inngest.createFunction(
  {id: "index-repo"},
  {event: "repository.connected"},

  async ({event, step}) => {
    const {owner, repo, userId} = event.data

    // files
    const files = await step.run("fetch-files", async () => {
      const account = await prisma.account.findFirst({
        where: {
          userId: userId,
          providerId: "github"
        }
      })
      if(!account?.accessToken) throw new Error("No GitHub access token found")

      return await getRepoFileContents(account.accessToken, owner, repo)
    })

    await step.run("index-codebase", async () => {
      await indexCodebase(`${owner}/${repo}`, files)
    })

    return {
      success: true,
      indexFiles: files.length
    }
  }
)