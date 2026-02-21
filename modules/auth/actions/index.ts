"use server"

import { auth } from "@/lib/auth"
import { APIError } from "better-auth"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"



export const getCurruntUser = async () => {
    try {

        const session = await auth.api.getSession({
            headers: await headers()
        })

        return {
            success: true,
            data: session?.user
        }
        
    } catch (error) {
        if(APIError) return {
            success: false,
            error: APIError.name
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : "Server error."
        }
    }
}


export const handleSignout = async () => {
    try {
        await auth.api.signOut({
            headers: await headers()
        })

        revalidatePath("/dashboard")

    } catch (error) {
        if(APIError) return {
            success: false,
            error: APIError.name
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : "Server error."
        }
    }
}

export const getSessionUser  = async () => {
    try {
        
        const session = await auth.api.getSession({
            headers: await headers()
        })
        if(!session) throw new Error("Unauthorized")

        return session

    } catch (error) {
        console.error("Server error for get session user: ", error)
        return;
    }
}