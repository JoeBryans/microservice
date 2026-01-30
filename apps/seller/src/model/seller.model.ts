import { Schema, model, Types } from "mongoose"
export interface SellerInterface {
    userId: Types.ObjectId;
    _id?: Types.ObjectId;
    email: string;
    name: string;
    phone: string;
    status: "PENDING" | "APPROVED" | "SUSPENDED";
    onboardingStep: "REGISTERED" | "EMAIL_VERIFIED" | "ADDRESS_ADDED" | "SHOP_REGISTERED" | "BUSINESS_INFO" | "SHIPPING_INFO" | "BANK_DETAILS" | "DOCUMENTS" | "COMPLETED";
    documents: {
        idCard: string;
        businessCert: string;
    };
    verifiedAt: Date;
    verified: boolean;
    rejectionReason?: string;
    isActive: boolean;
    approvedAt?: Date;
    suspendedAt?: Date;
    onboardingHistory?: [
        {
            step: string;
            status: string;
            reason: string;
            timestamp: Date;
        }
    ]
}
export const SellerSchema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            required: true,
            index: true
        },
        name: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ["PENDING", "APPROVED", "SUSPENDED"],
            default: "PENDING",
            index: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        verifiedAt: {
            type: Date,
            default: Date.now,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        phone: {
            type: String
        },
        onboardingStep: {
            type: String,
            enum: [
                "REGISTERED",
                "EMAIL_VERIFIED",
                "ADDRESS_ADDED",
                "SHOP_REGISTERED",
                "BUSINESS_INFO",
                "SHIPPING_INFO",
                "BANK_DETAILS",
                "DOCUMENTS",
                "COMPLETED"
            ],
            default: "REGISTERED"
        },

        onboardingHistory: [
            {
                step: {
                    type: String,
                    enum: [
                        "REGISTERED",
                        "AUTHENTICATED",
                        "ADDRESS_ADDED",
                        "SHOP_REGISTERED",
                        "BUSINESS_INFO",
                        "SHIPPING_INFO",
                        "BANK_DETAILS",
                        "DOCUMENTS",
                        "COMPLETED"
                    ],
                },
                status: {
                    type: String,
                    enum: ["STARTED", "COMPLETED", "FAILED"]
                },
                reason: String, // optional (no sensitive data)
                timestamp: {
                    type: Date,
                    default: Date.now
                }
            }
        ],


        businessInfo: {
            businessName: { type: String },

            businessType: {
                type: String,
                enum: ['INDIVIDUAL', 'REGISTERED_BUSINESS'],

            },

            registrationNumber: {
                type: String,
                required: function () {
                    return this.businessInfo.businessType === 'REGISTERED_BUSINESS';
                },
            },

            contactName: { type: String },
        },

        shippingInfo: {
            shippingAddress: {
                country: String,
                city: String,
                state: String,
                zipCode: String,
                location: String
            },
            shippingMethod: {
                type: String,
                enum: ['STANDARD_DELIVERY', 'EXPRESS_DELIVERY', 'PICKUP',],
                default: 'STANDARD_DELIVERY'
            },
            regionalPricing: [
                {
                    region: String,
                    price: Number,
                }
            ],
            // internationalPricing: {
            //     country: String,
            //     price: Number,
            // },
            isFreeDelivery: {
                type: Boolean,
                default: false
            },
            // shippingCharge: {
            //     type: Number,
            //     default: 0
            // },


        },
        paymentInfo: {
            provider: {
                type: String,
                enum: ['PAYSTACK', 'FLUTTERWAVE'],
            },
            bankName: String,
            bankCode: String,
            accountName: String,
            accountNumber: String,
            businessName: String,
            subAccountCode: String,
            settlementBank: String,
            percentageCharge: Number,
            currency: String,
            verified: {
                type: Boolean,
                default: false
            },
            isActive: {
                type: Boolean,
                default: false
            },
        },

        documents: {
            idCardType: {
                type: String,
                enum: ['PASSPORT', 'DRIVING_LICENSE', 'ID_CARD', 'VOTERS_CARD', 'OTHER'],
                default: 'OTHER'
            },
            idCard: {
                url: String,
                verified: {
                    type: Boolean,
                    default: false
                }
            },
            businessCert: {
                url: String,
                verified: {
                    type: Boolean,
                    default: false
                }
            }
        },

        rejectionReason: {
            type: String
        },
        addressInfo: [
            {
                country: String,
                city: String,
                state: String,
                zipCode: String,
                location: String
            }
        ],


        // shopId: {
        //     type: Types.ObjectId,
        //     ref: "shop",
        //     required: false,
        // },
        isActive: {
            type: Boolean,
            default: true
        },
        approvedAt: Date,
        suspendedAt: Date
    },
    {
        timestamps: true
    }
)

export const sellerModel = model("seller", SellerSchema)
