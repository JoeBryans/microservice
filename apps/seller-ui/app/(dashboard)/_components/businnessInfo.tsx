"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import SubmitButton from '@/components/ui/submitButton'
import { toast } from 'sonner'
import axios from 'axios'
import LoggedUser from '@/components/custom/user'
import SellerInfo from '@/components/custom/Seller'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MoreHorizontalIcon } from 'lucide-react'
import ActionButton from './ActionButton'

const BusinessInfoSchema = z.object({
  businessName: z.string().min(2, 'Business Name must be at least 2 characters long'),
  businessType: z.string().min(2, 'Business Type must be at least 2 characters long'),
  registrationNumber: z.string(),
  contactName: z.string().min(2, 'Contact Name must be at least 2 characters long'),
});


const url_endpoint = `${process.env.NEXT_PUBLIC_API_URL}`;

const BusinnessInfo = () => {
 const auth = LoggedUser();
  const form = useForm({
    resolver: zodResolver(BusinessInfoSchema),
    defaultValues: {
      businessName:'',
      businessType: "INDIVIDUAL",
      registrationNumber: '',
      contactName: '',
    },
  })
  const seller = SellerInfo()

  const business_type=form.watch('businessType')
  console.log("business_type:", business_type);



  async function onsubmit(data: z.infer<typeof BusinessInfoSchema>) {
    try {
      const response = await axios.post(`${url_endpoint}/v1/seller/business-info`,
        {
          
            businessName: data.businessName,
            businessType: data.businessType,
            registrationNumber: data.registrationNumber,
            contactName: data.contactName,
          
          
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
        toast.success("Business Information updated successfully")
      }
    }
    catch (error: any) {
      console.log("error: ", error);
      toast.error("Failed to update business information:" + error.response.data.message)
      throw error;
    }
  }

  console.log("businessInfo: ", seller?.businessInfo);

  if (seller && !seller.businessInfo) {
    return <div
    className='flex flex-col gap-4'
    >
      <div
        className='flex flex-col gap-2 '
      >
        <h1
          className='text-xl text-gray-700 my-4 '
        >Business/Legal Representative Details</h1>
        <p
          className='text-md text-gray-500'
        >Please fill in the following information to complete your business profile.</p>
      </div>

      <Form {...form}>
    <form 
    className='space-y-4'
    onSubmit={form.handleSubmit(onsubmit)}
    >
      <FormField
        name='businessName'
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Name</FormLabel>
            <FormControl>
              <Input placeholder="Business Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name='businessType'
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Type</FormLabel>
            <FormControl>
              <select {...field}
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              >
                <option value="INDIVIDUAL">Individual</option>
                <option value="REGISTERED_BUSINESS">Registered Business</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name='registrationNumber'
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Registration Number</FormLabel>
            <FormControl>
              <Input placeholder="Registration Number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name='contactName'
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Name</FormLabel>
            <FormControl>
              <Input placeholder="Contact Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <div className='w-full flex justify-end my-5'>
            <SubmitButton name="Continue" isLoading={false} />
       </div>
    </form>
      </Form>
      
    </div>
  }else{
    return <div
      className='flex flex-col gap-4'
    >
      <div
        className='flex flex-col gap-2 '
      >
      
        <div className='w-full flex flex-col gap-4  bg-white p-8 rounded-lg shadow-lg'>
          <div className='text-center'>
            <h1
              className='text-xl text-gray-700 my-4 '
            >Business/Legal Representative Details</h1>
            <p
              className='text-md text-gray-500'
            >here is your business information</p>

          </div>
          <BusinessInfoTable businessInfo={seller?.businessInfo} />

    </div>
    </div>
    </div>
  }
}

export default BusinnessInfo 


const BusinessInfoTable = ({ businessInfo }: { businessInfo: any }) => {
  return (
    <div className='w-full'>  
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Business Name</TableHead>
          <TableHead>Business Type</TableHead>
          <TableHead>Registration Number</TableHead>
          <TableHead>Contact Name</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>{businessInfo?.businessName}</TableCell>
          <TableCell>{businessInfo?.businessType}</TableCell>
          <TableCell>{businessInfo?.registrationNumber}</TableCell>
          <TableCell>{businessInfo?.contactName}</TableCell>
          <TableCell>
             <ActionButton
               path="/dashboard/settings/business-info"
              //  editPath="/dashboard//edit"
               id={businessInfo?._id}
               actions={["Edit", "Delete"]}
             />
          </TableCell>

        </TableRow>
      </TableBody>
    </Table>
  </div>
  )
} 