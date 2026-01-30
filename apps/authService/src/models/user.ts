import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        // select: false 
    },
    phone: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        enum: ["ADMIN", "SELLER", "USER"],
        default: "USER"
    },
    verified: {
        type: Boolean,
        default: false
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

const User = mongoose.model("auth", userSchema);
export default User;