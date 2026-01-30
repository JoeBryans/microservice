import { Document, Schema, Types, model } from "mongoose";

const requestBrandSchema = new Schema({
    sellerId: {
        type: Types.ObjectId,
        required: true,
    },

    name: {
        type: String,
        required: true,
    },
    website: {
        type: String,
    },
    satus: {
        type: String,
        required: true,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING",
    },
    reviewedBy: {
        id: {
            type: Types.ObjectId,
        },
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        role: {
            type: String,
            enum: ["SELLER", "ADMIN"],
            default: "seller",
        },

    }
    //  createdBy:,
}, {
    timestamps: true,
});

export const RequestBrand = model("requestBrand", requestBrandSchema);