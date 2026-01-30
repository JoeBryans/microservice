import { Router } from "express"
import BrandController from "../controller/brand.controller"


const brandRoutes = Router()

brandRoutes.get("/",BrandController.getBrands)
brandRoutes.get("/:id",BrandController.getBrand)
brandRoutes.post("/",BrandController.createBrand)
brandRoutes.put("/:id",BrandController.updateBrand)

export default brandRoutes