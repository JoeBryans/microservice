import { HttpErrorBadRequest } from "@repose/error"
import { ShopModel } from "../model/shop.model"
import axios from "axios"

interface ShopData {
    userId: string
    name: string
    slug: string
    description: string
    logo: string
    banner: string
    addressInfo: {
        country: string
        city: string
        state: string
        zipCode: string
        location: string
    }
}

export class ShopService {
    constructor() { }

    async create(shopData: ShopData) {
        console.log("shopData:", shopData)
        try {
            const { userId, name, slug, description, logo, banner, addressInfo } = shopData

            if (!userId || !name || !slug) {
                throw new HttpErrorBadRequest("Please provide all required fields");
            }

            const sellerId = await this.getSellerId(userId)
            //   console.log("sellerId:",sellerId)
            if (!sellerId) {
                throw new HttpErrorBadRequest("sellerId is not found")
            }
            const shop = await ShopModel.create({
                sellerId,
                name,
                slug,
                description,
                logo,
                banner,
                addressInfo
            })

            return shop
        } catch (error) {
            console.error(error)
        }
    }
    async getSellerId(userId: string) {
        try {
            const seller = await axios.get(`http://localhost:4006/api/seller/${userId}`,
                {
                    headers: {
                        "x-internal-key": process.env.INTERNAL_SERVICE_KEY!
                    }

                })
            // console.log("sellerId:", seller.data)
            return seller.data._id
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async getByOwner(sellerId: string) {
        try {
            const shop = await ShopModel.find({ sellerId: sellerId })
            console.log("shop:", shop)
            return shop
        } catch (error) {
            console.error(error);
            return error;
        }
    }

}