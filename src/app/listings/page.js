

import Authuserverify from '@/components/shared/AuthVerify'
import dynamic from 'next/dynamic'
const  ListingsWrapper = dynamic(()=> import('@/components/listings/ListingsWrapper'))
import React from 'react'

function page() {
  return (
    <Authuserverify>
        <ListingsWrapper/>
    </Authuserverify>
    
  )
}

export default page