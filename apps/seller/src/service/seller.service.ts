import { HttpErrorBadRequest } from "@repose/error";
import { SellerInterface, sellerModel } from "../model/seller.model"

export class SellerService {
    constructor() { }

    async handleCreate(seller: SellerInterface) {
        const { _id, email, phone, name } = seller
        console.log("Creating seller for userId: ", seller);

        const existingSeller = await sellerModel.findOne({ userId: _id })

        console.log("existingSeller: ", existingSeller);

        if (existingSeller) {
            throw new Error("Seller profile already exists for this user")
        }

        const Seller = await sellerModel.create({
            userId: _id,
            isActive: true,
            email,
            phone,
            name,
            onboardingStep: "REGISTERED",
            status: "PENDING",
            rejectionReason: "",
            onboardingHistory: [
                {
                    step: "REGISTERED",
                    status: "COMPLETED",
                    reason: "",
                    timestamp: new Date(),
                }
            ]

        })
        return Seller
    }

    async getSeller(id: string) {
        try {
            const seller = await this.findByUserId(id)
            return seller
        } catch (error) {
            console.error(error);
            throw error
        }
    }

    async findByUserId(userId: string) {
        try {
            const seller = await sellerModel.findOne({ userId })
            return seller
        } catch (error) {
            console.error(error);
            throw error
        }
    }

    async businessInfo(sellerId: string, businessInfo: {
        businessName: string,
        businessType: "INDIVIDUAL" | "REGISTERED_BUSINESS",
        registrationNumber: string,
        contactName: string,

    }) {
        try {

            const { businessName, businessType, registrationNumber, contactName } = businessInfo

            if (!businessName || !contactName || !businessType) {
                throw new HttpErrorBadRequest("Business name, contact name and business type are required")
            }

            if (businessInfo.businessType === "REGISTERED_BUSINESS" && !businessInfo.registrationNumber) {
                throw new HttpErrorBadRequest("Registration number is required for registered business")
            }

            const seller = await sellerModel.findOneAndUpdate({ userId: sellerId }, {
                $set: {
                    businessInfo,
                    onboardingStep: "BUSINESS_INFO",
                },
                $push: {
                    onboardingHistory: {
                        step: "BUSINESS_INFO",
                        status: "COMPLETED",
                        reason: "",
                        timestamp: new Date(),
                    }
                }
            }, { new: true })

            seller?.onboardingHistory?.push({
                step: "BUSINESS_INFO",
                status: "COMPLETED",
                reason: "",
                timestamp: new Date(),
            })


            return seller
        } catch (error) {
            console.error(error);
            throw error
        }
    }

    async shippingInfo(sellerId: string,
        shippingInfo: {

            country: string,
            city: string,
            state: string,
            zipCode: string,
            location: string,

            shippingMethod: "STANDARD_DELIVERY" | "EXPRESS_DELIVERY" | "PICKUP",
            regionalPricing: [
                {
                    region: string,
                    price: number,
                }
            ],
            isFreeDelivery: boolean,
        }
    ) {
        try {
            const { shippingMethod, regionalPricing } = shippingInfo

            const shippingAddress = {
                country: shippingInfo.country,
                city: shippingInfo.city,
                state: shippingInfo.state,
                zipCode: shippingInfo.zipCode,
                location: shippingInfo.location
            }

            console.log("shippingInfo: ", shippingInfo);

            if (!shippingAddress || !shippingMethod || !regionalPricing) {
                throw new HttpErrorBadRequest("Shipping address, shipping method and regional pricing are required")
            }




            const result = await sellerModel.findOneAndUpdate({ userId: sellerId }, {
                $set: {
                    shippingInfo: {
                        shippingAddress,
                        shippingMethod,
                        regionalPricing: regionalPricing
                    },
                    onboardingStep: "SHIPPING_INFO",

                },
                $push: { onboardingHistory: { step: "SHIPPING_INFO", status: "COMPLETED", reason: "", timestamp: new Date() } }
            },
                { new: true });



            return result

        } catch (error) {
            console.error(error);
            throw error
        }
    }



    async paymentInfo(sellerId: string, paymentData: any) {
        try {
            const seller = await sellerModel.findOneAndUpdate({ userId: sellerId }, {
                $set: {
                    paymentInfo: paymentData,
                    onboardingStep: "PAYMENT_INFO",
                    isActive: true,
                    verified: false,
                },
                $push: {
                    onboardingHistory: {
                        step: "PAYMENT_INFO",
                        status: "COMPLETED",
                        reason: "",
                        timestamp: new Date(),
                    }
                }

            }, { new: true })



            console.log("payInfo: ", seller);


            return seller

        } catch (error) {
            console.error(error);
            throw error
        }
    }
}