import mongoose,{   Types } from "mongoose";

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    logo: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    //  createdBy:{
    //          id: {
    //              type: Types.ObjectId,
    //          },
    //          name: {
    //              type: String,
    //          },
    //          email: {
    //              type: String,
    //          },
    //          role: {
    //              type: String,
    //              enum: ["SELLER", "ADMIN"],
    //              default: "seller",
    //          },
     
    //      },
}, {
    timestamps: true,
});

export const brandModel = mongoose.model("brand", brandSchema);


// export interface BrandDocument extends typeof brandSchema.Types {
//   _id: string;
// }   