
import dynamic from 'next/dynamic'
const  InvoiceScreen = dynamic(()=> import('@/components/Invoices/InVoiceScreen'))
import React from 'react'

function page() {
  return (
    <InvoiceScreen />
  )
}

export default page