
import Authuserverify from '@/components/shared/AuthVerify'
import dynamic from 'next/dynamic'
const  InvoiceScreen = dynamic(()=> import('@/components/Invoices/InVoiceScreen'))
import React from 'react'

function page() {
  return (
    <Authuserverify>
         <InvoiceScreen />
    </Authuserverify>
   
  )
}

export default page