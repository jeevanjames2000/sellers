
import Authuserverify from '@/components/shared/AuthVerify'
import dynamic from 'next/dynamic'
const  DashboardWrapper = dynamic(()=> import('@/components/dashboard/DashboardWrapper'))
import React from 'react'

function page() {
  return (
    <Authuserverify>
        <DashboardWrapper />
    </Authuserverify>
    
  )
}

export default page