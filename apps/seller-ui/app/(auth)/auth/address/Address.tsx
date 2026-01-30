"use client"
import { Input } from '@/components/ui/input'
import SubmitButton from '../../../../components/ui/submitButton'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { use, useEffect } from 'react'
import axios from 'axios'
import LoggedUser from '@/components/custom/user'

// import UserAuth from '@/components/custom/Auth'
const AddressSchema = z.object({
    country: z.string().min(2, 'Country must be at least 2 characters long'),
    state: z.string().min(2, 'State must be at least 2 characters long'),
    city: z.string().min(2, 'City must be at least 2 characters long'),
    location: z.string().min(2, 'Location must be at least 2 characters long'),
    zipCode: z.string().min(2, 'ZipCode must be at least 2 characters long')
});

const url_endpoint = `${process.env.NEXT_PUBLIC_API_URL}`;

const Address = () => {
    const auth = LoggedUser();



    const form = useForm({

        resolver: zodResolver(AddressSchema),
        defaultValues: {
            country: "",
            state: "",
            city: "",
            location: "",
            zipCode: ""
        },
    })
    const router = useRouter()
    const isLoading = form.formState.isSubmitting



    // useEffect(() => {
    //     if (auth) {
    //         const fetchUser = async () => {
    //             const userDetails = await getUserDetails(auth?.id!);
    //             console.log("userDetailsAddress: ", userDetails);

    //             if (userDetails?.onboardingStep === "ADDRESS_ADDED") {
    //                 router.push('/auth/register-shop')
    //             }
    //         }

    //         fetchUser()


            
    //     }
    // }, [auth])

    async function onSubmit(data: z.infer<typeof AddressSchema>) {
        try {
            const response = await axios.post(`${url_endpoint}/v1/seller/address`, 
                    data,
                {
               
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${auth?.accessToken}`,
                },
                withCredentials: true,
            });
            console.log("res: ", await response);
            if (response.data && response.status === 201 ) {
                alert("success")
                router.push("/auth/register-shop")

            }
        }
        catch (error) {
            console.log("error: ", error);
            
            throw error;
        }
    }


    return (
        <div className='w-xl min-h-screen flex justify-center items-center'>


            <Form {...form}>

                <form onSubmit={form.handleSubmit(onSubmit)} className='w-full flex justify-center'>

                    <div
                        className='w-lg flex flex-col gap-4  bg-white p-8 rounded-lg shadow-lg'>



                        <FormField
                            name='country'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Country" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name='state'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                        <Input placeholder="State" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name='city'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="City" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name='location'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Location" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name='zipCode'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Zip Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Zip Code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />




                        <SubmitButton name="Create" isLoading={isLoading} />

                    </div>
                </form>
            </Form>
        </div>
    )
}

export default Address


