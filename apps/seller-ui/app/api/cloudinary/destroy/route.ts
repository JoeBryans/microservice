// src/app/api/delete-image/route.js (App Router example)

import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
    try {
        const { publicId } = await req.json();

        if (!publicId) {
            return NextResponse.json({ error: 'Public ID is required' }, { status: 400 });
        }
        const public_id = publicId
        console.log("public_id: ", public_id);

        // Use the destroy method to delete the image
      const result= await cloudinary.uploader.destroy(public_id, { invalidate: true }, (error, result) => {
            if (error) {
                console.error("Error deleting image:", error);
                return NextResponse.json({ error: "Error deleting image" }, { status: 500 });
            }
            console.log("Result:", result);
            return NextResponse.json({ result }, { status: 200 });
        });


        // Optional: Invalidate the image on the CDN so it's not cached
        // const result = await cloudinary.uploader.destroy(publicId, { invalidate: true });


        return NextResponse.json({ msg: 'Image successfully deleted!', result }, { status: 200 });
    } catch (error: any) {
        console.error('Deletion error:', error);
        return NextResponse.json({ msg: 'Something went wrong!', error: error.message }, { status: 500 });
    }
}
