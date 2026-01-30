import React from 'react'
import AddVarient from './varient'
interface Props {
  params: {
    id: string
  }
}
const page = async({ params }: Props) => {
    const param=await params
    const id = param.id
    // console.log("id: ", id)
  return (
    <div className='w-full min-h-screen px-5 '>
        <AddVarient id={id} />
    </div>
  )
}

export default page