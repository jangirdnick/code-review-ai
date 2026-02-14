import { getCurruntUser } from '@/modules/auth/actions'
import React from 'react'

export default async function UserCOM() {

  const user = await getCurruntUser()

  return (
    <div>
      {user.success && user.data?.name}
    </div>
  )
}
