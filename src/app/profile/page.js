
import Authuserverify from '@/components/shared/AuthVerify'
import dynamic from 'next/dynamic'
const  ProfileScreen = dynamic(()=> import('@/components/profile/ProfileScreen'))
import React from 'react'

function page() {
  return (
    <Authuserverify>
         <ProfileScreen />
    </Authuserverify>
   
  )
}

export default page