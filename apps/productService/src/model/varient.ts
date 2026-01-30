import mongoose from "mongoose"

export const varientSchema = new mongoose.Schema({
    color: {
        type: String
    },
    size: {
        type: String
    },
    sku: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    images: [
        {
            url: {
                type: String,
                required: true
            },
            public_id: {
                type: String,
            }
        }
    ],
    stock: {
        type: Number,
        default: 0
    },
    instock: {
        type: Boolean,
        default: true
    },
    isActive: {
        type: Boolean,
        default: true
    },



}, {
    _id: true

})