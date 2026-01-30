"use client"
import React from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import SubmitButton from '@/components/ui/submitButton'
import { Input } from '@/components/ui/input'

const EmailSchema = z.object({
    email: z.email().min(2, 'Email must be at least 2 characters long'),
});

const url_endpoint = `${process.env.NEXT_PUBLIC_API_URL}`;

const Email = ({ setFormRegisterStep }: { setFormRegisterStep: React.Dispatch<React.SetStateAction<number>> }) => {
    const form = useForm({
        resolver: zodResolver(EmailSchema),
        defaultValues: {
            email: '',
        },
    })
    const isLoading = form.formState.isSubmitting


    // console.log(emails);

    async function onSubmit(data: z.infer<typeof EmailSchema>) {
        try {
            const response = await fetch(
                `${url_endpoint}/v1/auth/check-email`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: data.email,
                    }),
                    credentials: 'include',
                }


            )
            if (!response.ok) {
                throw new Error("Failed to check email");
            }
            if (response.ok) {
                setFormRegisterStep(1)
                return;
            }
        } catch (error) {
            console.log(error)
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
                                    <FormControl >

                                        <Input placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    <SubmitButton name="Next" isLoading={isLoading} />
                    </div>
                </form>
            </Form>

        </div>
    )
}

export default Email