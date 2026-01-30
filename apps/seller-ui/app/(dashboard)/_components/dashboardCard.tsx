"use client"
import SellerInfo from '@/components/custom/Seller'
import LoggedUser from '@/components/custom/user'
import { Book, Check, CheckCheckIcon, CreditCard, Ellipsis, HandCoins, Ship, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'



const DashboardCard = ({ setActiveId }: any) => {
    const auth= LoggedUser();

    const user=auth?.user
    // const [seller, setSeller] = useState<any>(null)
     const seller=SellerInfo()
    // console.log("auth: ", auth);
    


    const isCompleted = (stepName: string) => {
        return seller?.onboardingHistory?.some(
            (item: any) => item.step === stepName && item.status === "COMPLETED"
        );
    };

    // console.log("onboardingSteps: ", onboardingSteps);

    const SetUpInfo = [
        {
            name: "Shop Information",
            url: "#shop-info",
            icon: ShoppingBag,
            status: isCompleted("SHOP_REGISTERED") ? "completed" : "pending",
        },
        {
            name: "Business Information",
            url: "#business-info",
            icon: HandCoins,
            status: isCompleted("BUSINESS_INFO") ? "completed" : "pending",
        },
        {
            name: "Shipping Information",
            url: "#shipping-info",
            icon: Ship,
            status: isCompleted("SHIPPING_INFO") ? "completed" : "pending",
        },
        {
            name: "Payment Information",
            url: "#payment-info",
            icon: CreditCard,
            status: isCompleted("PAYMENT_INFO") ? "completed" : "pending",
        },
        {
            name: "Document Information",
            url: "#document-info",
            icon: Book,
            status: isCompleted("DOCUMENT_INFO") ? "completed" : "pending",
        }
    ];





    console.log(seller);


    return (
        <div className='w-full mx-auto max-w-5xl'>
            <h1 className='text-3xl text-gray-900 my-4 '>Your Shop is now ready!</h1>
            <span
                className='text-md text-gray-500 mt-2 '
            >You can now start creating your products and sell them to your customers.</span>

            <div className='flex gap-4 flex-wrap items-center mt-5 shadow p-4 rounded-lg max-w-4xl w-full mx-auto'>
                {SetUpInfo.map((item) => (
                    <Link
                        href={item.url}
                        key={item.name}
                        onClick={()=>setActiveId(item.url)}
                        className='flex flex-col items-center gap-4 p-4 rounded-lg border border-gray-200 shadow-sm w-full sm:w-40'

                    >
                        <div className='flex gap-4'>
                            <h2 className=' font-semibold text-gray-700 line-clamp-2'>{item.name}</h2>
                            <item.icon className='h-8 w-8 text-emerald-500' />
                        </div>
                        <div className='flex gap-1 items-center'>
                            <span
                                className={`${item.status === "completed" ? "bg-emerald-500" : "bg-gray-500"} rounded-full`}
                            >
                                {
                                    item.status === "completed" ? <Check className='h-4 w-4 text-gray-50 ' /> : <Ellipsis className='h-4 w-4 text-gray-50 ' />
                                }

                            </span>
                            <span className='text-sm text-gray-500'>{item.status}</span>
                        </div>
                    </Link>
                ))}

            </div>
        </div>
    )
}

export default DashboardCard