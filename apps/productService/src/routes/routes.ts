import { Router } from "express"
import { productsController } from "../controller/product.controller"
import BrandController from "../controller/brand.controller"

const router = Router()


router.get("/", productsController.getProducts)
router.post("/create", productsController.create)
router.post("/:id", productsController.createVarient)
router.get("/search", productsController.filterProducts)
// router.get("/:id", productsController.getProduct)
router.get("/variant/:id", productsController.getProductVariant)
// router.put("/:id", productsController.update)
router.delete("/:id", productsController.deleteProduct)
router.put("/variant/:id", productsController.updateVarient)
// router.delete("/varient/:id", productsController.deleteVarient)
router.delete("/variant/:variantId/image",productsController.deleteImage)

// brand routes


export default router