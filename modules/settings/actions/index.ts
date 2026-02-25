"use server"

import prisma from "@/lib/db"
import { getSessionUser } from "@/modules/auth/actions"
import { deleteWebHook } from "@/modules/github/lib/github"
import { revalidatePath } from "next/cache"



export async function getUserProfile() {
  try {
    
    const session = await getSessionUser()
    if(!session) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({
      where: {id: session.user.id},
      select: {
        id: true, name: true, email: true, image: true, createdAt: true
      }
    })

    return user;

  } catch (error) {
    console.error("Error fetching user profile: ", error)
    return null;
  }
}

export async function updateUserProfile(
  data: {
    name?: string, email?: string
}) {
  try {
    
    const session = await getSessionUser()
    if(!session?.user) throw new Error("Unauthorized")

    if(!data.name?.trim() || !data.email?.trim()) {
      throw new Error("No changes detacted.")
    }

    const updatedUser = await prisma.user.update({
      where: {id: session.user.id},
      data: {
        name: data.name, email: data.email
      },
      select: {
        id: true, name: true, email: true
      }
    })

    revalidatePath("/dashboard/settings", "page")

    return {success: true, user: updatedUser }

  } catch (error) {
    console.error("Error updating user profile: ", error)
    return {success: false, error: "Failed to update profile"}
  }
}

export async function getConnectedRepositories() {
  try {
    
    const session = await getSessionUser();
    if(!session) throw new Error("Unauthorized")

    const repositories = await prisma.repository.findMany({
      where: {userId: session.user.id},
      select: {
        id: true, name: true, fullName: true, url: true, createdAt: true
      }, orderBy: {createdAt: "desc"}
    })

    return repositories;

  } catch (error) {
    console.error("Error fetching connected respositories: ", error)
    return []
  }
}

export async function disconnectRepository(repositoryId: string) {
  
  if(!repositoryId.trim()) throw new Error("Repository ID is required")

  try {

    const session = await getSessionUser()
    if(!session) throw new Error("Unauthorized")

    const repository = await prisma.repository.findUnique({
      where: {id: repositoryId, userId: session.user.id}
    })
    if(!repository) throw new Error("Repository not found")

    await deleteWebHook(repository.owner, repository.name)
    await prisma.repository.delete({
      where: {
        id: repositoryId, userId: session.user.id
      }
    })

    revalidatePath("/dashboard/settings", "page")
    revalidatePath("/dashboard/repository", "page")
    return {success: true, 
      message: `Repository ${repository.name.slice(0,10)} disconnected successfully`
    }

  } catch (error) {
    console.error("Error disconnect repository: ", error)
    return {success: false, error: "Failed to disconnect repository"}
  }
}

export async function disconnectAllRepository() {
  try {
    
    const session = await getSessionUser()
    if(!session) throw new Error("Unauthorized")

    const repository = await prisma.repository.findMany({
      where: {userId: session.user.id}
    })
    if(!repository) throw new Error("Repository not found")

    await Promise.all(repository.map(async (repo) => {
      await deleteWebHook(repo.owner, repo.name)
    }))

    const result =  await prisma.repository.deleteMany({
      where: {
        userId: session.user.id
      }
    })

    revalidatePath("/dashboard/settings", "page")
    revalidatePath("/dashboard/repository", "page")
    return {success: true, count: result.count}

  } catch (error) {
    console.error("Error disconnect all repository: ", error)
    return {success: false, error: "Failed to disconnect all repository"}
  }
}