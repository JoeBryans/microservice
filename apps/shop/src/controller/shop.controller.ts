import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asynHandler";
import { ShopService } from "../service/shop.service";
import { PublishEvent } from "../utils/producer";

const shopService = new ShopService();

export const ShopController = {
    create: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.headers["x-user-id"] as string;
        console.log("userIds:", userId);
      console.log(req.body);

        const result = await shopService.create({ userId, ...req.body })

        if(result){
         await PublishEvent(result,"shop.created")
        }

        return res.status(201).json(result);
    }),

    getByOwner:asyncHandler(async(req:Request,res:Response)=>{
        const userId = req.headers["x-user-id"] as string;
        const sellerId=req.params.sellerId
        console.log("sellerId:", sellerId);
        return res.status(200).json(await shopService.getByOwner(sellerId))
    })
    // getShop:asyncHandler(async(req:Request,res:Response)=>{
    //     const userId = req.headers["x-user-id"] as string;
    //     const sellerId=req.params.sellerId
    //     console.log("sellerId:", sellerId);
    //     return res.status(200).json(await shopService.getShop(sellerId))
    // })
}