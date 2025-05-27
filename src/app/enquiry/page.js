
import dynamic from 'next/dynamic'
const  EnquiriesWrapper = dynamic(()=> import('@/components/enquires/EnquiresWrapper'))
import React from 'react'

function page() {
  return (
    <EnquiriesWrapper />
  )
}

export default page