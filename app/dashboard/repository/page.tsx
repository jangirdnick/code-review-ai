"use client"

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import RepositoryListSkeleton from '@/modules/repository/components/repository-list-skeleton';
import { useRepositories } from '@/modules/repository/hooks/use-repositories';
import { ExternalLink, Search, Star } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react'


interface Repository {
  id:                 number;
  name:               string;
  full_name:          string;
  description:        string | null;
  html_url:           string;
  stargazers_count:   number;
  language:           string | null;
  topics:             string[]
  isConnected?:       boolean
}

export default function RepositoryPage() {

  const {data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage} = useRepositories()

  const [searchQurey, setSearchQurey] = useState("")
  const [localConnectingId, setLocalConnectingId] = useState<number | null>(null)
  const observerTarget = useRef<HTMLDivElement>(null)


  useEffect(()=>{
    const observer = new IntersectionObserver(
      (entries)=>{
        if(entries[0].isIntersecting && hasNextPage && !isFetchingNextPage){
          fetchNextPage()
        }
      },{
        threshold:0.1
      }
    )

    const currentTarget = observerTarget.current
    if(currentTarget){
      observer.observe(currentTarget)
    }

    return () => {
      if(currentTarget){
        observer.unobserve(currentTarget)
      }
    }

  },[hasNextPage, isFetchingNextPage, fetchNextPage])


  if(isLoading) return (
    <div className='space-y-4'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>
          Repositories
        </h1>
        <p className='text-muted-foreground'>
          Manage and view all your GitHub repositories
        </p>
      </div>
      <RepositoryListSkeleton />
    </div>
  )

  if(isError) return (
    <div>Failed to load repositories.</div>
  )

  const allRepositories = data?.pages.flatMap(page=>page) || []

  const filterRepositories = allRepositories.filter((repo) =>
  repo !== undefined &&
  (repo.name.toLowerCase().includes(searchQurey.toLowerCase()) ||
  repo.full_name.toLowerCase().includes(searchQurey.toLowerCase()))
  ) as Repository[]

  const handleConnect = (repo:Repository) => {

  }

  return (
    <div className='space-y-4'>
      <div className='space-y-1'>
        <h1
        className='text-3xl font-bold tracking-tight'>
          Repositories
        </h1>

        <p
        className='text-muted-foreground'>
          Manage and view all your GitHub repositories
        </p>
      </div>

      <div
      className='relative'>
        <Search className='absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
        <Input 
        placeholder='Search repositories...'
        className={"pl-8"}
        value={searchQurey}
        onChange={(e) => setSearchQurey(e.target.value)}/>
      </div>
      
      <div
      className='grid gap-4'>
        {
          filterRepositories.map(repo => (
            <Card
            key={repo.id}
            className='hover:shadow-md transition-shadow'>
              <CardHeader>
                <div
                className='flex items-start justify-between'>
                  <div
                  className='space-y-2 flex-1'>
                    <div
                    className='flex items-center gap-2'>
                      <CardTitle
                  className='text-lg'>
                    {repo.name}
                      </CardTitle>
                      <Badge variant={"outline"}>
                    {repo.language || "unknow"}
                      </Badge>
                      {repo.isConnected && <Badge variant={"secondary"}>Connected</Badge>}
                    </div>
                    <CardDescription>{repo.description}</CardDescription>

                  </div>
                    <div className='flex gap-2'>
                      <Button
                      variant={"ghost"} size={"icon"} asChild>
                        <Link href={repo.html_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className='w-4 h-4' />
                        </Link>
                      </Button>

                      <Button
                      onClick={() => handleConnect(repo)}
                      disabled={localConnectingId === repo.id || repo.isConnected}
                      variant={repo.isConnected ? "outline" : "default"}>
                        {localConnectingId === repo.id ? "Connecting..." : repo.isConnected ? "connected" : "connect"}
                      </Button>
                    </div>
                </div>
              </CardHeader>

              <CardContent>
                <div
                className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                  <div
                  className='flex items-center gap-1'>
                    <Star className='w-4 h-4 fill-yellow-400 text-yellow-500' />
                    <span className='text-sm font-medium'>{repo.stargazers_count}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        }
      </div>

      <div ref={observerTarget}>
        {isFetchingNextPage && <RepositoryListSkeleton />}
        {
          !hasNextPage && allRepositories.length > 0 && (
            <p
            className='text-center text-muted-foreground'>
              No More Repositories
            </p>
          )
        }
      </div>
    </div>
  )
}
