import { Request, Response } from "express"
import { asyncHandler } from "../utils/asyncHandler"
import { SellerService } from "../service/seller.service"
import { createSubAccount, verifyBankCode } from "../utils/paystack/paystack"
import { sellerModel } from "../model/seller.model"

const sellerService = new SellerService()

export const SellerController = {

    create: asyncHandler(async (req: Request, res: Response) => {
        console.log("   req.body:", req.body);
        const internalKey = req.headers["x-internal-key"]

        if (internalKey !== process.env.INTERNAL_SERVICE_KEY) {
            throw new Error("Invalid internal key");
        }



        res.status(201).json("Seller created successfully")
    }),

    getSeller: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params
        console.log("id: ", id);
        res.status(200).json(await sellerService.getSeller(id))
    }),

    businessInfo: asyncHandler(async (req: Request, res: Response) => {
        // const { id } = req.params
        const sellerId = req.headers["x-user-id"] as string
        console.log("sellerId: ", sellerId);
        console.log("req.body: ", req.body);


        res.status(200).json(await sellerService.businessInfo(sellerId, req.body))
    }),

    shippingInfo: asyncHandler(async (req: Request, res: Response) => {
        const sellerId = req.headers["x-user-id"] as string
        console.log("sellerId: ", sellerId);
        console.log("body: ", req.body);

        res.status(200).json(await sellerService.shippingInfo(sellerId, req.body))
    }),
    paymentInfo: asyncHandler(async (req: Request, res: Response) => {
        const sellerId = req.headers["x-user-id"] as string

        console.log("body: ", req.body);

        const verifyBank = await verifyBankCode(req.body.bankCode, req.body.accountNumber)
        console.log("verifyBankCode: ", verifyBankCode);

        if (verifyBank.status === true) {
            const payload = {
                business_name: req.body.businessName,
                settlement_bank: req.body.bankCode,
                account_number: req.body.accountNumber,
                percentage_charge: 5,
                description: "Subaccount for Seller",
            }
            const createSub = await createSubAccount(payload)
            console.log("createSub: ", createSub);

            const data = createSub?.data

            const paymentData = {
                businessName: data.business_name,
                bankCode: req.body.bankCode,
                bankName: req.body.bankName,
                accountNumber: data.account_number,
                percentage_charge: data.percentage_charge,
                accountName: data.account_name,
                subAccountCode: data.subaccount_code,
                settlementBank: data.settlement_bank,
                currency: data.currency,

            }

            const payment_Info = await sellerService.paymentInfo(sellerId, paymentData)

            res.status(200).json(payment_Info)
        }
    }),

    onboardingStep: asyncHandler(async (req: Request, res: Response) => {
        const sellerId = req.headers["x-user-id"] as string
        console.log("sellerId: ", sellerId);
        const onboardingStep = await sellerModel.findOneAndUpdate({ _id: sellerId }, { onboardingStep: req.body.onboardingStep }, { new: true });

        res.status(200).json(onboardingStep)
    }),
}   