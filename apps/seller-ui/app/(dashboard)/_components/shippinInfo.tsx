"use client"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React, { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import SubmitButton from '@/components/ui/submitButton'
import { toast } from 'sonner'
import { count } from 'console'
import RegionPricing from './regionPricing'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import LoggedUser from '@/components/custom/user'

const ShippingInfoSchema = z.object({
  country: z.string().min(2, 'Shipping Address Country must be at least 2 characters long'),
  city: z.string().min(2, 'Shipping Address City must be at least 2 characters long'),
  state: z.string().min(2, 'Shipping Address State must be at least 2 characters long'),
  zipCode: z.string().min(2, 'Shipping Address Zip Code must be at least 2 characters long'),
  location: z.string().min(2, 'Shipping Address Location must be at least 2 characters long'),

  shippingMethod: z.string().min(2, 'Shipping Method must be at least 2 characters long'),
  // regionalPricing: z.number().min(2, 'Regional Pricing must be at least 2 characters long'),
  // internationalPricing: z.number(),
});


const url_endpoint = `${process.env.NEXT_PUBLIC_API_URL}`;

const ShippinInfo = () => {
 const auth = LoggedUser();
  const [seller, setSeller] = useState<any>(null)

  const [regional, setRegional] = useState<{ price: number, region: string } | null>(null)
  console.log(regional);

  console.log("regional: ", regional);


  const form = useForm({
    resolver: zodResolver(ShippingInfoSchema),
    defaultValues: {
      country: '',
      city: '',
      state: '',
      zipCode: '',
      location: '',
      shippingMethod: "STANDARD_DELIVERY",
        
      // internationalPricing: 0,
    },
  })

  const shipping_method = form.watch('shippingMethod')
  console.log("shipping_method:", shipping_method);
  // useEffect(() => {

  //   async function getUser() {
  //     const sellerDetails = await getUserDetails(data?.id!);
  //     setSeller(sellerDetails)
  //     console.log("sellerDetails:", sellerDetails);
  //   }

  //   if (data) {
  //     getUser()
  //   }
  // }, [data])

  const isLoading = form.formState.isSubmitting

  async function onsubmit(data: z.infer<typeof ShippingInfoSchema>) {
    try {
      const response = await axios.post(`${url_endpoint}/v1/seller/shipping-info`,
        {

          country: data.country,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          location: data.location,
          shippingMethod: data.shippingMethod,
          regionalPricing: regional       // internationalPricing: data.internationalPricing,


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
      if (response.data && response.status === 200) {
        toast.success("Shipping Information updated successfully")
      }
    }
    catch (error: any) {
      console.log("error: ", error);
      toast.error("Failed to update shipping information:" + error.response.data.message)
      throw error;
    }
  }

  if (seller && seller.shippingInfo) {
    return <div
      className='flex flex-col gap-4'
    >
      <div
        className='flex flex-col gap-2 '
      >
        <h1
          className='text-xl text-gray-700 my-4 '
        >Shipping Information</h1>
        <p
          className='text-md text-gray-500'
        >Please fill in the following information to complete your shipping profile.</p>
      </div>

      <Form {...form}>
        <form
          className='space-y-4'
          onSubmit={form.handleSubmit(onsubmit)}
        >
          <div className='p-4  shadow rounded-lg w-full'>
            <h2
              className='text-xl text-center mb-4 text-gray-700 my-4 '
            >Shipping Address</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 '>
              <FormField
                name='country'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder=" Country" {...field} />
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
                      <Input placeholder="city" {...field} />
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
            </div>
          </div>
          <div className='p-4  shadow rounded-lg w-full'>
            <h2
              className='text-xl text-center mb-4 text-gray-700 my-4 '
            >Shipping Method & Pricing</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 place-content-center '>
              <FormField
                name='shippingMethod'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Method</FormLabel>
                    <FormControl>
                      <select {...field}
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                      >
                        <option value="STANDARD_DELIVERY">Standard Delivery</option>
                        <option value="EXPRESS_DELIVERY">Express Delivery</option>
                        <option value="PICKUP">Pickup</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='mt-5 '>
                <RegionPricing setRegional={setRegional} />
              </div>
            </div>
          </div>
          <div className='w-full flex justify-end my-5'>
           <SubmitButton name="Save" isLoading={isLoading} />
          </div>

        </form>
      </Form>

    </div>
  } else {
    return (
      <div>ShippinInfo</div>
    )
  }
}

export default ShippinInfo