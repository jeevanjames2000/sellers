
import Authuserverify from '@/components/shared/AuthVerify'
import dynamic from 'next/dynamic'
const  EnquiriesWrapper = dynamic(()=> import('@/components/enquires/EnquiresWrapper'))
import React from 'react'

function page() {
  return (
    <Authuserverify>
         <EnquiriesWrapper />
    </Authuserverify>
   
  )
}

export default page