import React from 'react'
import   StepIndicator  from '../_component/steps'


const layout = async({ children }: { children: React.ReactNode }) => {

  return (
    <div className='w-full min-h-screen '>
      <div className='w-full max-w-7xl min-h-screen flex justify-center items-center gap-4 mx-auto  px-10'>

        <div className='w-md'>
          <StepIndicator/>

        </div>
        {children}
      </div>
 </div>

  )
}

export default layout