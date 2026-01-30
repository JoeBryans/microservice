"use client"
import { Input } from '@/components/ui/input'
import SubmitButton from '../../../../components/ui/submitButton'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { email, z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/hook/store'
import api from '@/actions/axiosConfig'
import { toast } from 'sonner'
const RegisterSchema = z.object({

    email: z.email('Invalid email address'),
    otp: z.string().min(6, 'OTP must be at least 6 characters long'),

});



const url_endpoint = `${process.env.NEXT_PUBLIC_API_URL}`;


const VerifyEmail = () => {
    const { data, isAuthenticated } = useSelector((state: RootState) => state.auth)
    const form = useForm({

        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: data?.email || '',
            otp: '',
        },
    })
    const router = useRouter()

    const isLoading = form.formState.isSubmitting

    async function onSubmit(data: z.infer<typeof RegisterSchema>) {
        try {
            const response = await api.post(`${url_endpoint}/verify-email`,
                {
                    email: data.email,
                    otp: data.otp,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                });
            console.log("res: ", response);
            if (response.data) {
                toast.success("Email verified successfully")
                router.push('/auth/address')
            }
        }
        catch (error: any) {
            console.log("error: ", error);
            toast.error("Failed to verify email: " + error.response.data.message)
            throw error;
        }
    }





    useEffect(() => {
        if (data?.verified) {
            router.push('/auth/address')
        }
    }, [data])

    return (
        <div className='w-xl min-h-screen flex justify-center items-center'>


            <Form {...form}>

                <form onSubmit={form.handleSubmit(onSubmit)} className='w-full flex justify-center'>

                    <div
                        className='w-lg flex flex-col gap-4  bg-white p-8 rounded-lg shadow-lg'>



                        <FormField
                            name='email'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name='otp'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>OTP</FormLabel>
                                    <FormControl>
                                        <Input placeholder="OTP" type="text" {...field} />
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
