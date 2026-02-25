"use client"

import { useState } from "react"
import { useDisconnectAllRepository, useDisconnectRepository, useRepository } from "../hooks/use-repository"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ExternalLink, Trash2 } from "lucide-react"
import Link from "next/link"

export default function ConnectedRepositoryList() {

  const [disconnectedAllOpen, setDisconnectedAllOpen] = useState(false)

  const {data: repositories, isLoading } = useRepository()
  const disconnectRepository = useDisconnectRepository()
  const disconnectAllRepository = useDisconnectAllRepository()

  if(isLoading) return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Repositories</CardTitle>
        <CardDescription>Manage your connected GitHub repositories</CardDescription>        
      </CardHeader>
      <CardContent>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Connected Repositories</CardTitle>
            <CardDescription>Manage your connected GitHub repositories</CardDescription>
          </div>
          {repositories && repositories.length > 0 && (
            <AlertDialog
            open={disconnectedAllOpen}
            onOpenChange={setDisconnectedAllOpen}>
              <AlertDialogTrigger asChild>
                <Button>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Disconnect All
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    <AlertTriangle className="w-5 h-5 text-destructive"/>
                    Disconnect All Repositories?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will disconnect all {repositories.length}
                    repositories and delete all associated AI reviews.
                    This action cannot undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                  onClick={() => disconnectAllRepository.mutate()}
                  className="bg-destructive text-destructive-foreground 
                  hover:bg-destructive/90"
                  disabled={disconnectAllRepository.isPending}>
                    {disconnectAllRepository.isPending 
                    ? "Disconnecting..." : "Disconnect All"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!repositories || repositories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No repositories connected</p>
            <p className="text-sm mt-2">
              Connect repositories form the Repository page.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {repositories.map((repo) => (
              <div
              key={repo.id}
              className="flex items-center justify-between p-4 
              border rounded-lg hover:bg-muted transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{repo.fullName}</h3>
                    <Link
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground">
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                    variant="outline" size="sm"
                    className="ml-4 text-destructive hover:text-destructive
                    hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Disconnect Repository?</AlertDialogTitle>
                       <AlertDialogDescription>
                        Are you sure you want to disconnect {repo.fullName}?
                        This will delete all associated AI reviews for this repository.
                        This action cannot undone.
                      </AlertDialogDescription>
                     <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                      onClick={() => disconnectRepository.mutate(repo.id)}
                      className="bg-destructive text-destructive-foreground 
                      hover:bg-destructive/90"
                      disabled={disconnectRepository.isPending}>
                        {disconnectRepository.isPending ? "Disconnecting..." : "Disconnect"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogHeader>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
