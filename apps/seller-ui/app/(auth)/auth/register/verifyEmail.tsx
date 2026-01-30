import { Input } from '@/components/ui/input'
import SubmitButton from '@/components/ui/submitButton'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { toast } from 'sonner'

const OtpSchema = z.object({
    otp: z.string().min(6, 'OTP must be at least 6 characters long'),
});

const url_endpoint = `${process.env.NEXT_PUBLIC_API_URL}`;

const VerifyEmail = ({setFormRegisterStep} : {setFormRegisterStep: React.Dispatch<React.SetStateAction<number>>}) => {
       const form = useForm({
            resolver: zodResolver(OtpSchema),
            defaultValues: {
                otp: '',
            },
        })

    const isLoading = form.formState.isSubmitting

      async function onSubmit(data: z.infer<typeof OtpSchema>) {
            try {
                const response = await fetch(
                    `${url_endpoint}/v1/auth/verify-email`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            otp: data.otp,
                        }),
                        credentials: 'include',
                    }
    
    
                )
                if (!response.ok) {
                    throw new Error("Failed to check email");
                }
                if (response.ok) {
                     setFormRegisterStep(2)
                    return;
                }
            } catch (error) {
                console.log(error)
                return error;
            }
        }
    
 

    return (
        <div className='w-xl min-h-screen flex justify-center items-center'>
                   <Form {...form}>
       
                       <form onSubmit={form.handleSubmit(onSubmit)} className='w-full flex justify-center'>
       
                           <div
                               className='w-lg flex flex-col gap-4  bg-white p-8 rounded-lg shadow-lg'>
                               <FormField
                                   name='otp'
                                   control={form.control}
                                   render={({ field }) => (
                                       <FormItem>
                                           <FormLabel>Otp</FormLabel>
                                           <FormControl >
       
                                               <Input placeholder="449620" {...field} />
                                           </FormControl>
                                           <FormMessage />
                                       </FormItem>
                                   )}
                               />
                           <SubmitButton name="Verify Email" isLoading={isLoading} />
                           </div>
                       </form>
                   </Form>
       
               </div>
    )
}

export default VerifyEmail