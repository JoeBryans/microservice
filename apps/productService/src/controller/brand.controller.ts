import { BrandService } from "../service/brand.service";
import { asyncHandler } from "../utils/asyncHandler";
import type { Request, Response } from "express";

const brandService = new BrandService();
const BrandController = {
    getBrands: asyncHandler(async (req: Request, res: Response) => {

        const brands = await brandService.getBrands();
        res.status(200).json(brands);

    }),
    getBrand: asyncHandler(async (req: Request, res: Response) => {

        const brand = await brandService.getBrand(req.params.id);
        res.status(200).json(brand);
    }),
    createBrand: asyncHandler(async (req: Request, res: Response) => {
      console.log(req.body);
        const brand = await brandService.createBrand(req.body);
        res.status(201).json(brand);

    }),
    updateBrand: asyncHandler(async (req: Request, res: Response) => {
        const brand = await brandService.updateBrand(req.params.id, req.body);

        res.status(200).json(brand);

    }),
    // async deleteBrand(req, res) {
    //     try {
    //         const brand = await Brand.findByIdAndDelete(req.params.id);
    //         res.status(200).json(brand);
    //     } catch (error) {
    //         res.status(500).json({ message: "Error occured" });
    //     }
    // },
};

export default BrandController;