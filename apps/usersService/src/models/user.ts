import mongoose from "mongoose";
export interface UserInterface {
    userId: string;
    _id?: string;
    name: string;
    email: string;
    role: string;
    image: string;
    isActive: boolean;
    verifiedAt: Date;
    verified: boolean;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
}
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
        unique: true,
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
    role: {
        type: String,
    },
    image: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    phone:{
        type: String
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

const UserProfile = mongoose.model("user", userSchema);
export default UserProfile;