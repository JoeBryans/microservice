import mongoos, { Types } from "mongoose"
import { varientSchema } from "./varient"

const productSchema = new mongoos.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    sellerId: {
        type: Types.ObjectId,
        required: true,
        index: true
    },
    shopId: {
        type: Types.ObjectId,
        required: true,
        index: true
     },
    brandId: {
        type: Types.ObjectId,

        ref: "brand"
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    categoryId: {
        type: Types.ObjectId,
    },
    price: {
        type: Number,
        required: true,
        index: true,
        default: 0

    },
    description: { type: String },
    coverImage: {
        type: String,
        // required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    variants: [varientSchema]

}, {
    timestamps: true
})


const ProductModel = mongoos.model("product", productSchema)

export default ProductModel

