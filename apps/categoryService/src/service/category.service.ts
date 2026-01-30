import { HttpError, HttpErrorNotFound } from "@repose/error";
import CategoryModel from "../model/category";
export interface CategoryType {
    slug: string,
    level: string,
    isLeaf: boolean,
    isActive: boolean,
    name?: string | null | undefined,
    parentId?: string | null | undefined,
}

export class CategoryService {
    constructor() { }


    async createCategory(category: CategoryType) {
        console.log(category);

        try {
            const { level, slug, name, parentId, isActive, isLeaf } = category

            if (!name || !slug) {
                throw new HttpError(402, "all field are required", true)
            }
            let hasParentId: any;
            if (parentId) {
                hasParentId = await this.categoryParentId(parentId!)

                // console.log("hasParentId: ", hasParentId);

            }
            if (parentId && hasParentId.isActive === false) {
                throw new HttpError(402, "can't add category under inactive parent", true)
            }
            const cat = await CategoryModel.create({
                name,
                slug,
                parentId: parentId ?? null,
                isActive: true,
                isLeaf: true,
                level: parentId ? hasParentId.level + 1 : 0,

            })
            console.log(cat);

            if (parentId) {
                await CategoryModel.updateOne(
                    { _id: parentId },
                    { isLeaf: false }

                )
            }

            return cat
        } catch (error) {
            console.log(error);

            return error
        }
    }

    async categoryParentId(id: string) {
        const parentId = await CategoryModel.findById(id)
        return parentId
    }

    async categoryById(id: string) {
        try {
            const category = await CategoryModel.findById(id)
            console.log(category);


            if (!category) {
                throw new HttpErrorNotFound("category id not found")
            }
            return category
        } catch (error) {
            console.log(error);

            return error
        }
    }

    async categoryIsLeaf(slug: string) {
        try {
            const category = await CategoryModel.findOne({ slug })
            if (!category?.isLeaf) {
                throw new HttpErrorNotFound("Product can only be add to leaf categories")
            }
            return category
        } catch (error) {
            console.log(error);

            return error
        }
    }

    async getCategories(next: any) {
        try {
            const categories = await CategoryModel.find({ isActive: true, isLeaf: true })
            console.log("categories: ", categories);
            return categories
        } catch (error) {
            console.error(error);
            return next(error)
        }
    }
}