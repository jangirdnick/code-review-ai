"use client"

import React, { useEffect, useState } from 'react'
import { useUpdateProfile, useUserProfile } from '../hooks/use-user-profile'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ProfileForm() {
  const { data: profile, isLoading } = useUserProfile()
  const updateProfile = useUpdateProfile()

  const [form, setForm] = useState({
    name: "",
    email: ""
  })

  useEffect(() => {
    if (profile && !form.name && !form.email) {
      setForm({
        name: profile.name ?? "",
        email: profile.email ?? "",
      })
    }
  }, [profile, setForm, form])

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(form)
  }

  if(isLoading) return (
    <Card>
      <CardHeader>
        <CardTitle>Profile settings</CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='animate-pulse space-y-4'>
          <div className='h-10 bg-muted rounded'></div>
          <div className='h-10 bg-muted rounded'></div>
        </div>
      </CardContent>
    </Card>
  )
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile settings</CardTitle>
        <CardDescription>Update your profile intormation</CardDescription>
      </CardHeader>
      <CardContent>
        <form
        onSubmit={handleSubmit}
        className='space-y-6'>
          <div className='space-y-2'>
            <Label>Full Name</Label>
            <Input
            id="name"
            placeholder='John Doe'
            value={form.name}
            onChange={(e)=> setForm({...form, name: e.target.value.toString()})}
            />
          </div>

          <div className='space-y-2'>
            <Label>Full Name</Label>
            <Input
            id="email"
            placeholder='example@gmail.com'
            value={form.email}
            onChange={(e)=> setForm({...form, email: e.target.value.toString()})}
            />
          </div>

          <Button
          type="submit" 
          disabled={updateProfile.isPending}
          className='cursor-pointer'>
            {updateProfile.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
