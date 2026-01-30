import React from 'react'
import EditVarient from './varient'

interface Props {
    params: {
        id: string
    }
}

const page =async ({ params }: Props) => {
    const param=await params
    const id = param.id
    
    return (
        <div>
            <EditVarient id={id} />
        </div>
    )
}

export default page