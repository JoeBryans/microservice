import { HttpErrorBadRequest } from "@repose/error";
import { ProductService } from "../service/product.service";
import { asyncHandler } from "../utils/asyncHandler";
import type { Request, Response } from "express"
const productService = new ProductService()
export const productsController = {
    create: asyncHandler(async (req: Request, res: Response) => {
        const body = req.body
        console.log("body: ", body);

        res.status(201).json(await productService.createProduct(body))
    }),

    createVarient: asyncHandler(async (req: Request, res: Response) => {
        const id: any = req.params.id

        res.status(200).json(await productService.createVarient(id, req.body))
    }),
    getProducts: asyncHandler(async (req: Request, res: Response) => {
        res.status(200).json(await productService.getProducts(req))
    }),

    filterProducts: asyncHandler(async (req: Request, res: Response) => {

        res.status(200).json(await productService.filterProducts(req))
    }),


    // getProduct:asyncHandler(async (req:Request,res:Response)=>{}),
    // update:asyncHandler(async (req:Request,res:Response)=>{}),
    deleteProduct: asyncHandler(async (req: Request, res: Response) => {
        const productId: string = req.params.id
        const sellerId: string = req.body.sellerId
        console.log("id: ", productId)
        console.log("sellerId: ", sellerId)
        res.status(200).json(await productService.deleteProduct(productId, sellerId))
    }),
    getProductVariant: asyncHandler(async (req: Request, res: Response) => {
        const id: any = req.params.id
        res.status(200).json(await productService.getProductVariant(id))
    }),
    updateVarient: asyncHandler(async (req: Request, res: Response) => {
        const id: string = req.params.id
        res.status(200).json(await productService.updateVarient(id, req.body))
    }),
    deleteVarient: asyncHandler(async (req: Request, res: Response) => {
        const productId: string = req.params.id
        const sellerId: string = req.body.sellerId
        console.log("id: ", productId)
        console.log("sellerId: ", sellerId)
        res.status(200).json(await productService.deleteProduct(productId, sellerId))
    }),

    deleteImage: asyncHandler(async (req: Request, res: Response) => {
        const id: any = req.params.variantId
        const url: string = req.body.url
        console.log("id: ", id)
        console.log("imageId: ", url)
        if (!id || !url) {
            throw new HttpErrorBadRequest("id and imageId are required")
        }
        // const imageId:any=req.params.d
        res.status(200).json(await productService.deleteImage(id, url))
    }),



}