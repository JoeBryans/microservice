import { Schema, model, Types } from "mongoose"

export const ShopSchema = new Schema(
    {
        sellerId: {
            type: Types.ObjectId,
            required: true,
            index: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true
        },

        description: {
            type: String
        },

        logo: {
            type: String
        },
        banner: {
            type: String
        },

        status: {
            type: String,
            enum: ["DRAFT", "ACTIVE", "SUSPENDED"],
            default: "DRAFT",
            index: true
        },

        addressInfo: {
            country: {
                type: String,
                index: true
            },
            city: {
                type: String,
                index: true
            },
            state: {
                type: String,
                index: true
            },
            zipCode: {
                type: String,
                index: true
            }
        },
        rating: {
            avarage: {
                type: Number,
                index: true
            },
            count: {
                type: Number,
                index: true
            }
        },

        metrics: {
            totalOrders: { type: Number, default: 0 },
            completedOrders: { type: Number, default: 0 },
            cancelledOrders: { type: Number, default: 0 }
        },
        badges: [String],

        policies: {
            returnPolicy: String,
            refundPolicy: String,
            shippingPolicy: String
        },
        review: {
            type: Types.ObjectId,
            ref: "review"
        },

        isVerified: {
            type: Boolean,
            default: false
        },

        isActive: {
            type: Boolean,
            default: true
        },

    }, {
    timestamps: true
})

export const ShopModel = model("shop", ShopSchema)
