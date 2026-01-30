import mongoose, { Types } from "mongoose";

export interface AddressInterface {
    userId: string;
    location: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    createdAt: Date;
    updatedAt: Date;
}

const addressSchema = new mongoose.Schema({

    userId: {
        type: Types.ObjectId,
        required: true,
        index: true,
    },
    location: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
        index: true,
    },
    state: {
        type: String,
        required: true,
        index: true,
    },
    zipCode: {
        type: String,
        required: true,
        index: true,
    },
    country: {
        type: String,
        required: true,
        index: true,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true
})

const AddressModel = mongoose.model("address", addressSchema);
export default AddressModel;