"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import { getSessionUser } from "@/modules/auth/actions"
import { getRepositories } from "@/modules/dashboard/actions"
import { createWebHook } from "@/modules/github/lib/github"
import { headers } from "next/headers"


export const fetchRepositories = async (page: number = 1, perPage: number = 10) => {
    try {
        
        const session = await auth.api.getSession({headers: await headers()})
        if(!session?.user) throw new Error("Unauthorized")

        const githubRepos = await getRepositories(page, perPage)

        const dbRepos = await prisma.repository.findMany({
            where: {userId: session.user.id}
        })

        const connectedRepoIds = new Set(dbRepos.map((repo => repo.githubId)))

        return githubRepos?.map((repo) => ({
            ...repo,
            isConnected: connectedRepoIds.has(BigInt(repo.id))
        }))

    } catch (error) {
        console.error("Server error for fetch repositories: ", error)
        return []
    }
}

export const connectRepository = async (owner: string, repo: string, githubId: number) => {
  try {

    const session = await getSessionUser()
    if(!session) throw new Error("Unauthorized")

    // TODO: Check if user can connect more repo

    const webhook = await createWebHook(owner, repo)
    if(webhook){
      await prisma.repository.create({
        data: {
          githubId: BigInt(githubId),
          name: repo,
          owner,
          fullName: `${owner}/${repo}`,
          url: `https://github.com/${owner}/${repo}`,
          userId: session?.user.id
        }
      })
    }

    // TODO: INCREMENT REPOSITORY COUNT FOR USAGE TRACKING

    // TODO: TRIGGER REPOSITORY INDEXING FOR RAG (FIRE AND FORGET)
    
    return webhook
    
  } catch (error) {
      console.error("Server error for connect repositories", error)
      return
  }
}