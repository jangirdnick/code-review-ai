"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { disconnectAllRepository, disconnectRepository, getConnectedRepositories } from "../actions"
import { toast } from "sonner"


// Fetches the connected repositories
export const useRepository = () => {
    return useQuery({
        queryKey: ["repository"],
        queryFn: async () => await getConnectedRepositories(),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false
    })
}

// Disconnects a repository by its ID
export const useDisconnectRepository = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (repositoryId: string) => await disconnectRepository(repositoryId),
        onSuccess: (result) => {
            if(result.success){
                queryClient.invalidateQueries({queryKey: ["repository"]})
                toast.success( result.message || "Repository disconnected successfully")
            } else toast.error(result.error || "Failed to disconnect repository")
        },
        onError: (err) => {
            toast.error("An error occurred while disconnecting the repository")
            console.error("Disconnect repository error: ", err)
        }
    })
}

// Disconnects all repositories for the user
export const useDisconnectAllRepository = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async () => await disconnectAllRepository(),
        onSuccess: (result) => {
            if(result.success){
                queryClient.invalidateQueries({queryKey: ["repository"]})
                toast.success("All repositories disconnected successfully")
            } else toast.error(result.error || "Failed to disconnect all repositories")
        },
        onError: (err) => {
            toast.error("An error occurred while disconnecting all repositories")
            console.error("Disconnect all repositories error: ", err)
        }
    })
}