import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import { headers } from "next/headers"
import {Octokit} from "octokit"


export const getGithubToken = async () => {
    const session = await auth.api.getSession({headers: await headers()})
    if(!session) throw new Error("Unauthorized")

    const account = await prisma.account.findFirst({
        where: {
            id: session.user.id,
            providerId: "github"
        }
    })
    if(!account?.accessToken) throw new Error("Not found github accesstoken")
    return account.accessToken
}


export async function fetchUserContribution(token:string, username: string) {
    const octokit = new Octokit({auth: token})

    const qurey = `
    qurey($username:String!){
      user(login:$username){
        contributionCollection {
          contributionCalendar{
            totalContributions
            weeks{
              contributionDays{
                contributionCount
                data
                color
              }
            }
          }
        }
      }
    }
    `

    interface contributiondata {
        user: {
            contributionCollection:{
                contributionCalendar:{
                    totalContributions: number,
                    weeks:{
                        contributionCount: number
                        data: string | Date
                        color: string
                    }
                }
            }
        }
    }

    try {
        const response: contributiondata = await octokit.graphql(qurey, {username})

        return response.user.contributionCollection.contributionCalendar
        

    } catch (error) {        

    }
}