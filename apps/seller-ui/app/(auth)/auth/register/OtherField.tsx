"use client"
import { createUserAction } from '@/actions/createUser'
import { Input } from '@/components/ui/input'
import SubmitButton from '../../../../components/ui/submitButton'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'

const RegisterSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.string(),
    phone: z.string().min(10, 'Phone number must be at least 10 digits long'),
    role: z.string(),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

    const url_endpoint = `${process.env.NEXT_PUBLIC_API_URL}`;
const OtherField = () => {
    const [isVerified, setIsVerified] = useState<{
        email: string;
        isVerified: boolean;
    } | null>(null);

    console.log("isVerified: ", isVerified);


    const form = useForm({

        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: '',
            email: "",
            phone: '',
            password: '',
            role: 'SELLER',
        },
    })
    const router = useRouter()

    const watchedEmail = form.watch("email")
    //    console.log("watchedEmail: ", watchedEmail);


    useEffect(() => {
        if (isVerified) {
            form.setValue("email", isVerified.email)
        }
    }, [isVerified])


    useEffect(() => {
        async function isVerified() {
            const res = await fetch(`/api/isVerifed`)
            // console.log("res: ", res);
            const resData = await res.json();
            setIsVerified(resData);
        }

            isVerified();
     
    }, [form.watch])


    const isLoading = form.formState.isSubmitting

    async function onSubmit(data: z.infer<typeof RegisterSchema>) {
        try {
            const response = await fetch(`${url_endpoint}/v1/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                credentials: "include",
            });
            console.log("res: ", await response);

            const responseData = await response.json();
            if (response.ok) {
                toast.success("User created successfully")
                router.push('/auth/address')
            }

        } catch (error: any) {
            console.log("error: ", error);
            toast.error("Failed to create user:" + error.response.data.message)
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
                                        <Input placeholder='Name' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />




                        <FormField
                            name='phone'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Phone" type="text" {...field} />
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

                        <SubmitButton name="Register" isLoading={isLoading} />
                        {/* <Button
                        className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded"
                        type="submit">Continue</Button> */}
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default OtherField


