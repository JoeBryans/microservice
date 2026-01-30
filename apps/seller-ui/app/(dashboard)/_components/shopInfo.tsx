"use client"
import { Input } from '@/components/ui/input'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import ImageUpload from '@/components/ui/image-upload'
import { Camera, Locate, MailIcon, MapPinIcon, MoreHorizontalIcon } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import e from 'cors'
import SubmitButton from '@/components/ui/submitButton'
import SellerInfo from '@/components/custom/Seller'
import axios from 'axios'
import LoggedUser from '@/components/custom/user'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import ActionButton from './ActionButton'

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

const ShopInfo = () => {
    const auth = LoggedUser();
    const [image, setImage] = useState<any>(null)
    const [bannerImage, setBannerImage] = useState<any>(null)
    const [shop, setShop] = useState<any>(null)
    const seller = SellerInfo();
    // console.log("auth: ", auth);


    const form = useForm({

        resolver: zodResolver(ShopSchema),
        defaultValues: {
            name: seller?.name ? seller.name : "",
            slug: seller?.slug ? seller.slug : "",
            description: seller?.description ? seller.description : "",
            logo: seller?.logo ? seller.logo : "",
            banner: seller?.banner ? seller.
                addressInfo : {
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

    // set address info
    useEffect(() => {

        if (seller?.addressInfo) {
            console.log("seller.address: ", seller?.addressInfo);

            form.setValue("addressInfo.city", seller?.addressInfo?.city)
            form.setValue("addressInfo.state", seller.addressInfo.state)
            form.setValue("addressInfo.zipCode", seller.addressInfo.zipCode)
            form.setValue("addressInfo.country", seller.addressInfo.country)
            form.setValue("addressInfo.location", seller.addressInfo.location)
        }

    }, [seller])

    // set logo
    useEffect(() => {
        if (image) {
            form.setValue("logo", image.secure_url)
        }
    }, [image])

    // set banner
    useEffect(() => {
        if (bannerImage) {
            form.setValue("logo", bannerImage.secure_url)
        }
    }, [bannerImage])

    // get shop
    useEffect(() => {
        if (seller !== null) {
            const fetchSeller = async () => {
                const shopDetails = await axios.get(`${url_endpoint}/v1/shop/owner/${seller?._id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${auth?.accessToken}`,
                        },
                        withCredentials: true,
                    }
                );
                // console.log("shopDetails:", shopDetails);
                setShop(shopDetails.data)
            }
            fetchSeller()
        }
    }, [seller])

    console.log("shop", shop);

    // create shop
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



    const isInclude = seller?.onboardingHistory?.some((item: any) => item.step === "SHOP_REGISTERED")
    console.log("isInclude: ", isInclude);

    if (!isInclude) {
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
    } else {
        return (
            <div className='max-w-2xl w-full min-h-screen flex justify-center items-center'>
                <div className='w-full flex flex-col gap-4  bg-white p-8 rounded-lg shadow-lg'>
                    <div className='text-center'>
                        <h1 className='text-2xl font-bold'>
                            Shop Registered Successfully
                        </h1>
                        <p className='text-gray-500 mt-2'>
                            Your shop has been registered successfully. You can now start selling your products.
                        </p>
                    </div>
                    <ShopTable shop={shop} />
                </div>
            </div>
        )
    }



}

export default ShopInfo



const ShopTable = ({ shop }: { shop: any }) => {
    return (
        <div className='w-full'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Logo</TableHead>
                        <TableHead>Banner</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        shop?.map((shop: any) => (
                            <TableRow key={shop._id}>
                                <TableCell>{shop.name}</TableCell>
                                <TableCell>{shop.slug}</TableCell>
                                <TableCell>
                                    <Image src={shop.logo} alt="logo" width={100} height={100} className='w-16 h-16 rounded-lg' />
                                </TableCell>
                                <TableCell>
                                    <Image src={shop.banner} alt="banner" width={100} height={100} className='w-16 h-16 rounded-lg' />
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="size-8">
                                                <MoreHorizontalIcon />
                                                <span className="sr-only">Open menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <span>{shop.addressInfo.country}</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <span>{shop.addressInfo.city}</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <span>{shop.addressInfo.state}</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                {shop.addressInfo.zipCode}
                                            </DropdownMenuItem>

                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                </TableCell>
                                <TableCell>
                                    <ActionButton
                                        path={`/dashboard/setting/shop`}
                                        id={shop._id}
                                        actions={[ "Edit", "Delete"]}
                                        />
                                </TableCell>

                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}


