import {Router} from 'express'
import CategoryController from '../controller/category.controller'


const router=Router()


router.post("/create",CategoryController.create)
router.get("/",CategoryController.getCategories)
router.get("/:id",CategoryController.getCategoryById)
router.get("/check/:id", CategoryController.CheckCategoryId)
router.get("/isleaf/:slug",CategoryController.CategoryIsLeaf)
router.post("/bulk",CategoryController.bulkCategory)



export default router