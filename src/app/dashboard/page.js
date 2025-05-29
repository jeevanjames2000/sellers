
import dynamic from 'next/dynamic'
const  DashboardWrapper = dynamic(()=> import('@/components/dashboard/DashboardWrapper'))
import React from 'react'

function page() {
  return (
    <DashboardWrapper />
  )
}

export default page