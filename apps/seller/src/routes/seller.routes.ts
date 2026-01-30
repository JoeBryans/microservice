import { Router } from "express"
import { SellerController } from "../controller/seller.controller"
import { AddressController } from "../controller/address.controller"

const router = Router()

// router.get("/", SellerController.getAll)
// router.get("/:id", SellerController.getOne)
router.post("/address", AddressController.create)
router.get("/:id", SellerController.getSeller)
router.post("/business-info", SellerController.businessInfo)
router.put("/onboarding-step", SellerController.onboardingStep)
router.post("/shipping-info", SellerController.shippingInfo)
router.post("/payment-info", SellerController.paymentInfo)




export default router