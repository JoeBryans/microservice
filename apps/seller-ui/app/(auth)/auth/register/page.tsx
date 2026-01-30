"use client" // Required for useState
import {  useState } from 'react'
import VerifyEmail from './verifyEmail'
import Email from './Email'
import OtherField from './OtherField'


const page = () => {
   
    const [formRegisterStep, setFormRegisterStep] = useState(0);


    return (
        <div className='w-xl min-h-screen flex justify-center items-center'>


            {
                formRegisterStep === 0 && <Email setFormRegisterStep={setFormRegisterStep} />
            }
            {
                formRegisterStep === 1 && <VerifyEmail setFormRegisterStep={setFormRegisterStep} />
            }
            {
                formRegisterStep === 2 && <OtherField />
            }


        </div>
    )
}

export default page


