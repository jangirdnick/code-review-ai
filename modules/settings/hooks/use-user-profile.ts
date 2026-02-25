"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getUserProfile, updateUserProfile } from "../actions"
import { toast } from "sonner"



export const useUserProfile = () => {
    return useQuery({
        queryKey: ["user-profile"],
        queryFn: async () => await getUserProfile(),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false
    })
}

export const useUpdateProfile = () => {
    const qureyClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: {
            name: string,
            email: string
        }) => updateUserProfile(data),
        onSuccess: (result) => {
            if(result.success){
                qureyClient.invalidateQueries({queryKey: ["user-profile"]})
                toast.success(`User ${result.user?.name} updated successfully.`)
            }
        },
        onError: (err) => {
            toast.error(err.message || "Failed to update profile")
        }
    })
}