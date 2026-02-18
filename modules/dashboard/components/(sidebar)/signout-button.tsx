"use client";

import { Button } from "@/components/ui/button";
import { handleSignout } from "@/modules/auth/actions";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SignoutButton() {
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    setIsPending(true);
    try {
      await handleSignout();
      toast.success("Signed out successfully");
    } catch (err) {
      toast.error("Failed to sign out. Please try again.");
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={isPending}
      variant="destructive"
      className="w-full justify-start gap-2 px-3 py-2.5 text-sm font-medium">
      <LogOut className="h-4 w-4" />
      {isPending ? "Logging out..." : "Log out"}
    </Button>
  );
}