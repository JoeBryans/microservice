import Paystack from "@paystack/paystack-sdk"
import { HttpErrorBadRequest } from "@repose/error"

interface verifyBankCodeResponse {
    status: boolean,
    message: string,
    data: {
        id: string,
        name: string,
        code: string,
        type: string,

    }
}

export type CreateRequest = {
    business_name: string;
    settlement_bank: string;
    account_number: string;
    percentage_charge: number;
    description?: string;
    primary_contact_email?: string;
    primary_contact_name?: string;
    primary_contact_phone?: string;
    metadata?: string;
}

export const paystack = new Paystack(
    process.env.PAYSTACK_API_SECRET,
)

export const verifyBankCode = async (bankCode: string, accountNumber: string) => {
    try {
        if (!bankCode || !accountNumber) {
            throw new HttpErrorBadRequest("Bank code and account name are required")
        }
        // const bank = await fetch(`https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`
        //     , {
        //         method: "GET",
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Authorization": `Bearer ${process.env.PAYSTACK_API_SECRET}`,
        //         },
        //     }
        // )

        // const bankData = await bank.json()

        // console.log("bankData: ", bankData);

        return {
            status: true,
            message: "Bank code verified successfully",
        }

    } catch (error) {
        console.error(error);
        throw error
    }
}
export const createSubAccount = async (requestParameters: CreateRequest) => {
    try {
        if (requestParameters.business_name === null || requestParameters.business_name === undefined) {
            throw new HttpErrorBadRequest('Required parameter business_name was null or undefined when calling create.');
        }
        if (requestParameters.settlement_bank === null || requestParameters.settlement_bank === undefined) {
            throw new HttpErrorBadRequest('Required parameter settlement_bank was null or undefined when calling create.');
        }
        if (requestParameters.account_number === null || requestParameters.account_number === undefined) {
            throw new HttpErrorBadRequest('Required parameter account_number was null or undefined when calling create.');
        }
        if (requestParameters.percentage_charge === null || requestParameters.percentage_charge === undefined) {
            throw new HttpErrorBadRequest('Required parameter percentage_charge was null or undefined when calling create.');
        }
        const subAccount = paystack.subaccount.create(requestParameters)

        console.log("subAccount: ", subAccount);
        return subAccount
    } catch (error) {
        console.error(error);
        throw error
    }
}   