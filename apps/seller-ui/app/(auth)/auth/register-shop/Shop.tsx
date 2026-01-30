"use client"
import { Input } from '@/components/ui/input'
import SubmitButton from '../../../../components/ui/submitButton'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import ImageUpload from '@/components/ui/image-upload'
import { Camera } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import axios from 'axios'
import LoggedUser from '@/components/custom/user'

const ShopSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    slug: z.string().min(2, 'Slug must be at least 2 characters long'),
    description: z.string().min(2, 'Description for the shop must be at least 20 characters long'),
    logo: z.string(),
    banner: z.string(),
    addressInfo: z.object({
        country: z.string(),
        state: z.string(),
        city: z.string(),
        location: z.string(),
        zipCode: z.string()
    })
});

const url_endpoint = `${process.env.NEXT_PUBLIC_API_URL}`;

const Shop = () => {
    const auth = LoggedUser();
    const [image, setImage] = useState<any>(null)
    const [bannerImage, setBannerImage] = useState<any>(null)
    const [seller, setSeller] = useState<any>(null)
    // console.log("sellerShop:", seller);


    const form = useForm({

        resolver: zodResolver(ShopSchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            logo: "",
            banner: "",
            addressInfo: {
                country: "",
                city: "",
                state: "",
                location: "",
                zipCode: ""
            }
        },
    })
    const router = useRouter()
    const dispatch = useDispatch()
    const isLoading = form.formState.isSubmitting

    const city=form.watch("addressInfo.city")
    console.log("city: ", city);
    const state=form.watch("addressInfo.state")
    console.log("state: ", state);


    // useEffect(() => {

    //     if (auth !== null) {
    //         const fetchSeller = async () => {
    //             const sellerDetails = await getUserDetails(auth?.id!);
    //             console.log("sellerDetails:", sellerDetails);
    //             setSeller(sellerDetails)
    //         }
    //         fetchSeller()
    //     }

    // }, [auth])

    // useEffect(() => {

    //     if (seller) {
    //         console.log("seller.address: ", seller.addressInfo);

    //         form.setValue("addressInfo.city", seller.addressInfo[0].city)
    //         form.setValue("addressInfo.state", seller.addressInfo[0].state)
    //         form.setValue("addressInfo.zipCode", seller.addressInfo[0].zipCode)
    //         form.setValue("addressInfo.country", seller.addressInfo[0].country)
    //         form.setValue("addressInfo.location", seller.addressInfo[0].location)
    //     }

    // }, [auth, seller])

    useEffect(() => {
        if (image) {
            form.setValue("logo", image.secure_url)
        }
    }, [image])

    useEffect(() => {
        if (bannerImage) {
            form.setValue("logo", bannerImage.secure_url)
        }
    }, [bannerImage])

    async function onSubmit(data: z.infer<typeof ShopSchema>) {
        // console.log("postData: ", data);
        try {
            const response = await axios.post(`${url_endpoint}/v1/shop/create`,
                {
                    name: data.name,
                    slug: data.slug,
                    description: data.description,
                    logo: data.logo,
                    banner: data.banner,
                    addressInfo: {
                        country: data.addressInfo.country,
                        city: data.addressInfo.city,
                        state: data.addressInfo.state,
                        zipCode: data.addressInfo.zipCode,
                        location: data.addressInfo.location
                    }
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${auth?.accessToken}`,
                    },
                    withCredentials: true,
                }
            );
            console.log("res: ", response);
            if (response.data && response.status === 201) {
                toast.success("Shop created successfully")
                router.push("/dashboard")
            }
        }
        catch (error: any) {
            console.log("error: ", error);
            toast.error("Failed to create shop:" + error.response.data.message)
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
                            name='name'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name='slug'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Slug" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name='description'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Shop Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />



                        <div className='w-full h-14 border-2 border-gray-300 border-dashed rounded-lg items-center justify-center flex flex-col'>
                            <div className='flex items-center justify-center '>
                                <ImageUpload setImage={setImage}
                                    name='upload your logo image here!'
                                />
                                <Camera className='w-6 h-6 text-gray-500 mx-2' />
                            </div>
                            <div className='text-sm text-gray-500 text-center'>
                                (Recommended: 300x300px)
                            </div>

                        </div>
                        {
                            image &&
                            <div className='text-gray-500 text-center w-28 '>
                                <Image
                                    src={image.secure_url}
                                    alt="logo"
                                    width={300}
                                    height={300}
                                    className='w-full  object-cover'
                                />
                            </div>
                        }
                        <div className='w-full h-14 border-2 border-gray-300 border-dashed rounded-lg items-center justify-center flex '>
                            <ImageUpload setImage={setBannerImage} name='upload your banner image here!' />
                            <Camera className='w-6 h-6 text-gray-500 mx-2' />

                        </div>
                        {
                            bannerImage &&
                            <div className='text-gray-500 text-center w-28 '>
                                <Image
                                    src={bannerImage.secure_url}
                                    alt="logo"
                                    width={300}
                                    height={300}
                                    className='w-full object-cover'
                                />
                            </div>
                        }


                        <SubmitButton name="Create" isLoading={isLoading} />

                    </div>
                </form>
            </Form>
        </div>
    )
}

export default Shop


