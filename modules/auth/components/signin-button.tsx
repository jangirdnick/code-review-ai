"use client"

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { Github } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SigninButton() {
  
  const [isLoading, setIsLoading] = useState(false)

  const handleSignin = async () => {
    setIsLoading(true)
    try {
      await signIn.social({
        provider: "github"
      })
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Signin failed try again.")
      setIsLoading(false)
    } finally {
      toast.success("Signin successfully")
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-bold uppercase text-sm tracking-wider text-zinc-500 border-b border-zinc-700 pb-2">
        Get Started
      </h3>
      <Button
      onClick={handleSignin}
        className="w-full md:w-auto  bg-zinc-800/60 backdrop-blur-md border border-zinc-600 hover:bg-zinc-700/60 text-white shadow-inner! shadow-blue-300/20 rounded-full py-6 md:px-6! text-lg font-semibold cursor-pointer">
        <Github className="w-5! h-5!" />
        {isLoading ? "Connecting..." : "Connect with GitHub"}
      </Button>
    </div>
  )
}
