
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import SubmitButton from '@/components/ui/submitButton'
import LoggedUser from '@/components/custom/user'
import axios from 'axios'


const PaymentInfoSchema = z.object({
    accountNumber: z.string().min(2, 'Account Number must be at least 2 characters long'),
    businessName: z.string().min(2, 'Business Name must be at least 2 characters long'),
    bankinfo: z.string().min(2, 'Bank Code must be at least 2 characters long'),
});

const url_endpoint = `${process.env.NEXT_PUBLIC_API_URL}`;

const PaymentInfo = () => {
    const auth = LoggedUser();

    const [seller, setSeller] = useState<any>(null)

    const [bankList, setBankList] = useState<any>([])

    console.log("banks: ", bankList);


    const form = useForm({
        resolver: zodResolver(PaymentInfoSchema),
        defaultValues: {
            accountNumber: "",
            businessName: "",
            bankinfo: "",
        },
    })

    useEffect(() => {
        async function getUser() {
            const banks = await fetch("https://api.paystack.co/bank",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer ",
                    },
                }
            )

            console.log("banks: ", banks);
            const bandsData = await banks.json()
            setBankList(bandsData.data)
            console.log("bandsData: ", bandsData);
        }
        getUser()
    }, [])

    // useEffect(() => {
    //     if (data) {
    //         async function getUser() {
    //             const sellerDetails = await getUserDetails(data?.id!);
    //             setSeller(sellerDetails)
    //             console.log("sellerDetails:", sellerDetails);
    //         }
    //         getUser()
    //     }
    // }, [data])


    const isLoading = form.formState.isSubmitting;
    const isBankCodeSelected = form.watch("bankinfo");

    const bankCode = isBankCodeSelected.length > 0 && JSON.parse(isBankCodeSelected).code;
    const bankName = isBankCodeSelected.length > 0 && JSON.parse(isBankCodeSelected).name;

    console.log("isBankCodeValid: ", bankCode);
    console.log("bankName: ", bankName);

    console.log("isBankCodeSelected: ", isBankCodeSelected);



    async function onsubmit(data: z.infer<typeof PaymentInfoSchema>) {
        try {
            const response = await axios.post(`${url_endpoint}/v1/seller/payment-info`,
                {
                    bankName: bankName,
                    accountNumber: data.accountNumber,
                    businessName: data.businessName,
                    bankCode: bankCode,
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
                toast.success("Payment Information updated successfully")
            }
        }
        catch (error: any) {
            console.log("error: ", error);
            toast.error("Failed to update payment information:" + error.response.data.message)
            throw error;
        }
    }

    if (seller && seller.paymentInfo?.isActive) {
        return (
            <div>   </div>
        )
    }
    else {
        return (
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onsubmit)} className='space-y-4'>
                        <div className='w-lg flex flex-col gap-4  bg-white p-8 rounded-lg shadow-lg'>
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
                                name='accountNumber'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Account Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Account Number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name='bankinfo'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Select Your Operating Bank</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={form.watch("bankinfo")}
                                                onValueChange={(value) => {

                                                    form.setValue("bankinfo", value);
                                                    console.log("value: ", value);
                                                }}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select bank" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {/* <SelectLabel>Select bank</SelectLabel> */}
                                                    {bankList.map((bank: any) => (
                                                        <SelectItem key={bank.id} value={JSON.stringify(bank)}>
                                                            {bank.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='w-full flex justify-end items-center mt-4'>
                                <SubmitButton

                                    isLoading={isLoading}
                                    name="Save"
                                />
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        )
    }

}

export default PaymentInfo
