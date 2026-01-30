"use client"
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ImageUpload from '@/components/ui/image-upload'
import SubmitButton from '@/components/ui/submitButton'
import { toast } from 'sonner'
import { createVarient } from '@/actions/product'
import { Button } from '@/components/ui/button'
 import MultiImageUpload from '@/components/ui/multi-image-upload'
import { Camera } from 'lucide-react'
const varientSchema = z.object({
    price: z.string().min(1, 'price is required'),
    sku: z.string().min(2, 'sku is required'),
   
    stockQty: z.string().min(1, 'stock qty is required'),
    color: z.string().min(1, 'color is required'),
    size: z.string().min(1, 'size is required'),
})

const AddVarient = ({ id }: { id: string }) => {
    const router = useRouter()
    const [images, setImages] = useState<{url:string,public_id:string}[]>([
    ])

    const form = useForm({
        resolver: zodResolver(varientSchema),
        defaultValues: {
            price: "",
            sku: "",
            stockQty: "",
            color: "",
            size: "",
        },
    })

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (data: z.infer<typeof varientSchema>) => {
        try {
            const response = await createVarient({...data,images}, id)
            console.log("response: ", response);
            if (response.data) {
                toast.success("Product varient created successfully")
                form.reset()

            }

        } catch (error: any) {
            console.log(error)
            toast.error("Something went wrong!: ", error)

        }
    }
    

    return (
        <div className='w-full min-h-screen px-5 '>
            <div className='flex flex-col gap-5 items-center justify-center w-full h-full'>
                <div>
                    <h1 className='text-3xl text-gray-900 my-4 '>Create a new product varient</h1>
                    <p className='text-gray-500 text-center text-sm'>
                        when you are done, click on Done button
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className='max-w-xl w-full flex flex-col gap-4  bg-white p-8 rounded-lg shadow-lg mb-10'
                    >

                        <FormField
                            name='price'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel >Base Price</FormLabel>
                                    <FormControl>
                                        <Input {...field}
                                            type='number'
                                            disabled={isLoading}
                                            placeholder='product price' className='w-full' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name='sku'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel >SKU</FormLabel>
                                    <FormControl>
                                        <Input {...field}
                                            disabled={isLoading}
                                            placeholder='SKU' className='w-full' />
                                    </FormControl>
                                    <FormDescription>
                                        This is the unique identifier for the product.
                                        <br />
                                        don't repit the same SKU for different varients
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                       

                        <FormField
                            name='stockQty'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel >Stock Qty</FormLabel>
                                    <FormControl>
                                        <Input {...field}
                                            type='number'
                                            disabled={isLoading}
                                            placeholder='Stock' className='w-full' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                       

                        <FormField
                            name='color'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel >Color</FormLabel>
                                    <FormControl>
                                        <Input {...field}
                                            disabled={isLoading}
                                            placeholder='Color' className='w-full' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name='size'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel >Size</FormLabel>
                                    <FormControl>
                                        <Input {...field}
                                            disabled={isLoading}
                                            placeholder='eg: M, L, XL' className='w-full' />
                                    </FormControl>
                                    <FormDescription>
                                        you can add multiple sizes, separated by comma  
                                        <br />
                                        eg: M, L, XL______or______  40,45,50
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='w-full h-14 border-2 border-gray-300 border-dashed rounded-lg items-center justify-center flex '>
                            <MultiImageUpload 
                             images={images}
                             setImage={setImages}
                            name='upload your images here!' icon={<Camera className='w-6 h-6 text-gray-500 mx-2' />} />
                        </div>

                        <div className='flex justify-between w-full gap-2 my-4'>
                            <Button
                                onClick={() => router.push(`/dashboard/products/`)}
                                type='button'
                                variant='secondary'
                                className='w-40'
                            >
                                Done
                            </Button>
                            <SubmitButton
                                name="Create"
                                isLoading={form.formState.isSubmitting}
                                className='w-48'

                            />
                        </div>

                    </form>
                </Form>
            </div>
        </div>
    )
}

export default AddVarient