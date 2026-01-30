"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation';
// import UserAuth from '@/components/custom/Auth';

type AuthStep = "REGISTERED" | "ADDRESS_ADDED"| "SHOP_REGISTERED";

const steps = [
    { label: "Register", value: "REGISTERED" },
    // { label: "Email Verified", value: "EMAIL_VERIFIED" },
    { label: "Address Added", value: "ADDRESS_ADDED" },
    { label: "Register Shop", value: "SHOP_REGISTERED" },
];

const StepIndicator = () => {
    const [sellerStep, setSellerStep] = useState("")
    // const auth=UserAuth();
    // console.log("auth: ", auth);
    const path=usePathname()
    const isLogin=path.includes("login")


    // useEffect(() => {
    //     if (!isLogin) {
    //     async function getUser() {
    //         const userDetails = await getUserDetails(auth?.id!);
    //         console.log("userDetails:", userDetails);
    //         setSellerStep(userDetails.onboardingStep)

    //         // router.push('/dashboard')
    //     }
    //     getUser()
    // }

    // }, [auth])

    const currentIndex = steps.findIndex(authStep => authStep.value === sellerStep);

    // console.log("currentIndex: ", currentIndex);


    return (
        <div className='w-full max-w-md flex flex-col gap-1 justify-center items-center'>
            <div className='w-sm'>
                <Image src="/seller.jpg" alt="logo" width={500} height={500}
                    className='w-full h-80 object-fill'
                />
            </div>


            <div className="flex items-center justify-between w-full max-w-60 mx-auto px-5">
                {steps.map((step, index) => {
                    const isCompleted = index < currentIndex;
                    const isActive = index === currentIndex;
                    // { console.log("is completed: ", isCompleted) }
                    // { console.log("is active: ", isActive) }

                    return (
                        <div key={step.value} className="flex-1 flex items-center ">
                            {/* Circle */}
                            <div
                                className={`
                w-5 h-5 rounded-full flex items-center justify-center 
                ${isCompleted ? "bg-emerald-700 text-white" : ""}
                ${isActive ? "border-2 border-emerald-600 text-emerald-500" : "border border-zinc-300 text-zinc-500"}
              `}
                            >
                                {isCompleted ? <span className='text-white'>✓</span> : index + 1}
                            </div>

                            {/* Line */}
                            {index !== steps.length - 1 && (
                                <div
                                    className={`
                  flex-1 h-1 
                  ${index < currentIndex ? "bg-emerald-500" : "bg-emerald-100"}
                `}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


export default StepIndicator;