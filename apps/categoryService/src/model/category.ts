import mongoose, { Types } from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    parentId: {
        type: Types.ObjectId,
        ref: "category",
        default: null

    },
    level: {
        type:Number,
        required: true,
        default:0
    },
    isLeaf: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true
    },
 


},{
    timestamps:true
})

const CategoryModel=mongoose.model("category",categorySchema)

export default CategoryModel