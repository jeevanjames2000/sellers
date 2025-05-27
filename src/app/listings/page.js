

import dynamic from 'next/dynamic'
const  ListingsWrapper = dynamic(()=> import('@/components/listings/ListingsWrapper'))
import React from 'react'

function page() {
  return (
    <ListingsWrapper/>
  )
}

export default page