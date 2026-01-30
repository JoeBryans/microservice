"use client"
import React, { useEffect, useState } from 'react'
import LoggedUser from './user'
const url_endpoint = `${process.env.NEXT_PUBLIC_API_URL}`;
const SellerInfo = () => {
    const [seller, setSeller] = useState<any>(null)
    const auth = LoggedUser()
    const user = auth?.user
    const token = auth?.accessToken as string
     
// console.log("user",user);


    if (user === null) {
        return ;
    }

    useEffect(() => {
        if (token !== null || token !== undefined ) {
            // console.log("token:", token);
            const fetchSeller = async () => {
                const sellerDetails = await fetch(`${url_endpoint}/v1/seller/${user?.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                })
                // console.log("sellerDetails:", sellerDetails);
                const data=await sellerDetails.json()
                // console.log("sellerDetails:", data);
                setSeller(data)
            }
            fetchSeller()
        }
    }, [user])

    if (seller) {
        return seller;
    }
    return null;
}

export default SellerInfo