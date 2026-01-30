import { Schema, model, Types } from "mongoose"

export const ReviewSchema = new Schema(
    {
        sellerId: {
            type: Types.ObjectId,
            required: true,
            index: true
        },
        shopId: {
            type: Types.ObjectId,
            ref: "shop",
            index: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true
        },
    }, {
    timestamps: true
})
export const ReviewModel = model("review", ReviewSchema)