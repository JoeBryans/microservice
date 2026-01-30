import { Request, Response } from "express";
import { CategoryService } from "../service/category.service";
import { HttpError } from "@repose/error";
import CategoryModel from "../model/category";
import { Types } from "mongoose";

const categoryService = new CategoryService()

const CategoryController = {
    create: async (req: Request, res: Response) => {
        console.log(req.body);

        try {
            res.status(201).json(await categoryService.createCategory(req.body))
        } catch (error) {
            res.json(error)
        }
    },

    getCategoryById: async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            console.log("id: ", id);

            res.status(200).json(await categoryService.categoryById(id))
        } catch (error) {
            console.log(error);
            res.status(500).json(error)
        }
    },
    CheckCategoryId: async (req: Request, res: Response) => {
        try {
            const internalKey = req.headers["x-internal-key"];

            if (internalKey !== process.env.INTERNAL_SERVICE_KEY) {
                throw new HttpError(402, "Invalid internal key", true);
            }

            const id = req.params.id
            console.log("id: ", id);

            res.status(200).json(await categoryService.categoryById(id))
        } catch (error) {
            console.log(error);
            res.status(500).json(error)
        }
    },
    CategoryIsLeaf: async (req: Request, res: Response) => {
        try {
            const id = req.params.slug

            res.status(200).json(await categoryService.categoryIsLeaf(id))
        } catch (error) {
            console.log(error);
            res.status(500).json(error)
        }
    },

    bulkCategory: async (req: Request, res: Response) => {
        try {
            const {ids} = req.body
            console.log("ids: ", ids);

            if (!Array.isArray(ids) || ids.length === 0) {
                return res.json([])
            }

            // sanitize ObjectIds
            const objectIds = ids
                .filter(id => Types.ObjectId.isValid(id))
                .map(id => new Types.ObjectId(id))

            
            const categories = await CategoryModel.find({ _id: { $in: ids } }).select("_id name slug parentId")
                .lean();
            console.log("categories: ", categories);
            res.status(200).json(categories)
        } catch (error) {
            console.log(error);
            res.status(500).json(error)
        }
    },

    getCategories: async (req: Request, res: Response) => {
        try {
            res.status(200).json(await categoryService.getCategories(res))
        } catch (error) {
            console.log(error);
            res.status(500).json(error)
        }
    }
}



export default CategoryController