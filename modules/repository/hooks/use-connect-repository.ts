"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { connectRepository } from "../actions"
import { toast } from "sonner"



export const useConnectRepository = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (
          {owner, repo, githubId}: 
          {owner:string, repo: string, githubId: number}) => {
            return await connectRepository(owner, repo, githubId)
        },
        onSuccess: () => {
          queryClient.invalidateQueries({queryKey: ["repositories"]})
          toast.success("Repository connectd successfully")
        },
        onError: (err) => {
          toast.error("Somthing we wrong for connecting repository")
          console.error(err)
        }
    })
}