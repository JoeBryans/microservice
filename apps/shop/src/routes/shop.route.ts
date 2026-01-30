import { Router } from "express"
import { ShopController } from "../controller/shop.controller"

const router = Router()

// router.get("/", ShopController.getAll)
// router.get("/search", ShopController.search)
router.get("/owner/:sellerId", ShopController.getByOwner)
// router.get("/:id", ShopController.getOne)
router.post("/create", ShopController.create)
// router.put("/:id", ShopController.update)
// router.delete("/:id", ShopController.delete)

export default router