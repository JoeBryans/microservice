"use client"

import { Input } from '@/components/ui/input'
import SubmitButton from '../../../../components/ui/submitButton'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import { signIn } from "next-auth/react"
import axios from "axios"
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { isLoggedIn } from '@/hook/slices/authSlice'
import Link from 'next/link'

// import { useAuth } from '@/context/auth/useAuth'
const LoginSchema = z.object({

    email: z.email('Invalid email address'),

    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const url_endpoint = `${process.env.NEXT_PUBLIC_API_URL}`;

const page = () => {

    const form = useForm({
        resolver: zodResolver(LoginSchema),
        defaultValues: {

            email: '',

            password: '',

        },
    })
    const router = useRouter()
   const dispatch = useDispatch()
    const isLoading = form.formState.isSubmitting

    async function onSubmit(data: z.infer<typeof LoginSchema>) {
        try {

            console.log(data)


            const respons = await axios.post(`${url_endpoint}/v1/auth/login`,
                {
                    email: data.email,
                    password: data.password,
                },
                {

                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,

                }

            )

            console.log("respons:", respons);
            const isData = respons.data
            if (respons?.data) {
                console.log("response:", isData);
                toast.success("login successful")
                dispatch(isLoggedIn(
                    {
                        user: {
                            id: isData.id,
                            email: isData.email,
                            phone: isData.phone,
                            name: isData.name,
                            role: isData.role,
                        },
                        accessToken: isData.accessToken,
                    }
                ) )
                // router.push('/dashboard')
            }
        } catch (error: any) {
            console.log("error:", error);
            toast.error("Failed to login: " + error.response.data.message)
            throw error
        }
    }






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
                            name='password'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Password" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <SubmitButton name="Login" isLoading={isLoading} />
                        <div
                            className='flex flex-wrap justify-center items-center'
                        >
                            <p>Don't have an account? <Link href="/auth/register" className='text-blue-500 hover:underline'>Create</Link></p>
                            <p>Forgot your password? <Link href="/auth/forgot-password" className='text-blue-500 hover:underline'>Reset Password</Link></p>

                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default page


