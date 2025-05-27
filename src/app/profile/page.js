
import dynamic from 'next/dynamic'
const  ProfileScreen = dynamic(()=> import('@/components/profile/ProfileScreen'))
import React from 'react'

function page() {
  return (
    <ProfileScreen />
  )
}

export default page