"use client"
import React, { use, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ImageUpload from '@/components/ui/image-upload'
import SubmitButton from '@/components/ui/submitButton'
import { getCategoriesData } from '@/actions/categories'
import { getBrandsData } from '@/actions/brands'
import { createProduct } from '@/actions/product'
import { toast } from 'sonner'
import axios from 'axios'
import SellerInfo from '@/components/custom/Seller'
import LoggedUser from '@/components/custom/user'
// import UserAuth from '@/components/custom/Auth'

const productSchema = z.object({
    name: z.string().min(2, 'name is required'),
    price: z.string().min(1, 'price is required'),
    brandId: z.string().min(2, 'brand is required'),
    shopId: z.string().min(2, 'shop is required'),
    description: z.string().min(2, 'description is required'),
    categoryId: z.string().min(2, 'category  is required'),
    coverImage: z.string(),
    slug: z.string().min(2, 'slug is required').toLowerCase(),
})

const url_endpoint = `${process.env.NEXT_PUBLIC_API_URL}`;

const AddProduct = () => {
    const [brands, setBrands] = React.useState<any>(null)
    const [categories, setCategories] = React.useState<any>([])
    const [coverImage, setCoverImage] = React.useState<any>([])
    const [shop, setShop] = React.useState<any>([])

    const auth = LoggedUser();
    const seller = SellerInfo()

    // console.log('brands', brands)
    // console.log('shop', shop)
    // console.log('categories', categories)

    const form = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            price: "0",
            brandId: '',
            description: '',
            categoryId: '',
            coverImage: '',
            slug: '',
        },
    })

    const router = useRouter()
    // const auth = UserAuth();

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (data: z.infer<typeof productSchema>) => {
        // console.log('data', data)
        try {
            const response = await createProduct({ ...data, sellerId: seller?._id })

            console.log("response: ", response);
            if (response.data) {
                toast.success("Product created successfully")
                router.push(`/dashboard/products/new/${response.data._id}`)
            }

        } catch (error: any) {
            console.log(error)
            toast.error("Something went wrong!: ", error)

        }
    }

    // get shop info    
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

    // save cover image to state
    useEffect(() => {
        if (coverImage) {
            form.setValue("coverImage", coverImage.secure_url)
        }
    }, [coverImage])

    // get categories
    useEffect(() => {
        async function getCategories() {
            const categories = await getCategoriesData()
            setCategories(categories)
        }
        getCategories()

    }, [])

    // get brands
    useEffect(() => {
        async function getBrands() {
            const brands = await getBrandsData()
            setBrands(brands)
        }
        getBrands()

    }, [])

    return (
        <div className='w-full min-h-screen px-5 '>
            <div className='flex flex-col gap-5 items-center justify-center w-full h-full'>
                <h1 className='text-3xl text-gray-900 my-4 '>Create a new product</h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className='max-w-xl w-full flex flex-col gap-4  bg-white p-8 rounded-lg shadow-lg'
                    >

                        <FormField
                            name='name'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel >Product Name</FormLabel>
                                    <FormControl>
                                        <Input {...field}
                                            disabled={isLoading}
                                            placeholder='product name' className='w-full' />
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
                                    <FormLabel >Product Slug</FormLabel>
                                    <FormControl>
                                        <Input {...field}
                                            disabled={isLoading}

                                            placeholder='product slug' className='w-full' />
                                    </FormControl>
                                    <FormDescription>
                                        This is the unique identifier for the product.
                                        <br />
                                        don't repit the same slug for different products
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name='price'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel >Product Price</FormLabel>
                                    <FormControl>
                                        <Input {...field}
                                            type='number'
                                            disabled={isLoading}
                                            placeholder='product price' className='w-full' />
                                    </FormControl>

                                    <FormDescription>
                                        You are to pay a commission of 5% on the sale of each product.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name='brandId'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel >Brand</FormLabel>
                                    <FormControl>

                                        <Select
                                            value={field.value}
                                            // onValueChange={field.onChange}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger
                                                disabled={isLoading}
                                                className='w-full'
                                            >
                                                <SelectValue placeholder='Select Brand' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {brands?.length > 0 && brands.map((brand: any) => (
                                                    <SelectItem
                                                        key={brand._id}
                                                        value={brand._id}>{brand.name}</SelectItem>
                                                ))}
                                            </SelectContent>

                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name='shopId'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel >Shop holding Product</FormLabel>
                                    <FormControl>

                                        <Select
                                            value={field.value}
                                            // onValueChange={field.onChange}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger
                                                disabled={isLoading}
                                                className='w-full'
                                            >
                                                <SelectValue placeholder='Select shop' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {shop?.length > 0 && shop.map((shop: any) => (
                                                    <SelectItem
                                                        key={shop._id}
                                                        value={shop._id}>{shop.name}</SelectItem>
                                                ))}
                                            </SelectContent>

                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />



                        <FormField
                            name='categoryId'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel >Category</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            // onValueChange={field.onChange}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger
                                                disabled={isLoading}
                                                className='w-full'

                                            >
                                                <SelectValue placeholder='Select Category' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories?.length > 0 && categories.map((category: any) => (
                                                    <SelectItem
                                                        key={category._id}
                                                        value={category._id}>{category.name}</SelectItem>
                                                ))}
                                            </SelectContent>

                                        </Select>
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
                                    <FormLabel >Product Description</FormLabel>
                                    <FormControl>
                                        <Input {...field}
                                            disabled={isLoading}
                                            placeholder='product description' className='w-full' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='w-full h-14 border-2 border-gray-300 border-dashed rounded-lg items-center justify-center flex '>

                            <ImageUpload setImage={setCoverImage} name='upload your cover image here!' />
                        </div>



                        <div className='flex justify-center'>
                            <SubmitButton
                                name="Create"
                                isLoading={form.formState.isSubmitting}
                            />
                        </div>


                    </form>
                </Form>
            </div>
        </div>
    )
}

export default AddProduct