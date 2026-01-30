// import { productsTypes } from "@repo/types";
import { HttpErrorBadRequest, HttpErrorNotFound, HttpErrorUnauthorized } from "@repose/error";
import { productsTypes, Variants } from "../types";
import ProductModel from "../model/product";
import axios from "axios"
import { Request } from "express";
import { brandModel } from "../model/brand";
import { Types } from "mongoose";
export class ProductService {
  constructor() { }

  async createProduct(product: productsTypes) {
    const { name, slug, price, shopId, sellerId } = product
    try {
      if (!name || !price || !slug || !sellerId || !shopId) {
        throw new HttpErrorBadRequest(
          "All field are required"
        )
      }
      const cat_id = await this.checkCategoryId(product.categoryId)
      console.log("cat_id", cat_id);


      if (!cat_id || cat_id === null) {
        throw new HttpErrorNotFound("category id is not found", true,)
      }

      const products = await ProductModel.create({
        name: name,
        price: price,
        sellerId: sellerId,
        shopId: shopId,
        categoryId: product.categoryId,
        slug: product.slug,
        coverImage: product.coverImage,
        description: product.description,
        brandId: product.brandId,
        isActive: true,
      })

      console.log("products: ", products);

      return products
    } catch (error) {
      console.log(error);
      throw error

    }
  }

  async checkCategoryId(id: string) {
    const result = await axios.get(`http://localhost:4004/api/category/${id}`, {
      headers: {
        "x-internal-key": process.env.INTERNAL_SERVICE_KEY!
      }
    })
    // console.log(result)
    const data = result.data
    return data
  }

  async createVarient(id: string, variants: Variants) {
    try {
      const productVariant = {
        price: variants.price,
        sku: variants.sku,
        images: variants.images,
        stock: variants.stock,
        instock: variants.instock,
        color: variants.color,
        size: variants.size,
        isActive: true

      }
      console.log(id);

      const variant = await ProductModel.findByIdAndUpdate({ _id: id }, {
        $push: {
          variants: productVariant
        }
      }, { new: true }
      )
      console.log(variant);

      return variant
    } catch (error) {
      console.log(error);

      return error
    }
  }

  async getProducts(req?: Request) {
    const page = Number(req?.query?.page || 1)
    const limit = 20
    const skip = (page - 1) * limit

    try {
      const filter: any = {
        isActive: true

      }



      const q = req?.query


      if (q?.search) {
        const brandName = { $regex: q.search, $options: 'i' }
        // filter.name=brandName
        const payload: any = {
          isActive: true
        }
        payload.name = brandName
        const brandId = await brandModel.findOne(payload).lean()
        console.log("brandId: ", brandId);
        if (brandId?._id) {

          filter.$or = [

            { brandId: brandId._id }
          ]
        } else {
          filter.$or = [
            { name: { $regex: q.search, $options: 'i' } },
            { slug: { $regex: q.search, $options: 'i' } }
          ]
        }


      }

      if (q?.name) {
        filter.$or = [
          { name: { $regex: q.name, $options: 'i' } },
        ]

      }
      if (q?.brand) {
        const brandName = { $regex: q.brand, $options: 'i' }
        // filter.name=brandName
        const payload: any = {
          isActive: true
        }
        payload.name = brandName
        const brandId = await brandModel.findOne(payload).lean()
        console.log("brandId: ", brandId);
        if (brandId?._id) {

          filter.$or = [
            { brandId: brandId._id },
          ]
        }
      }
      if (q?.slug) {
        filter.$or = [
          { slug: { $regex: q.slug, $options: 'i' } },
        ]
      }


      console.log("filter: ", filter);

      const products = await ProductModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).populate("brandId").lean();
      console.log("products: ", products);
      const categoryIds = [...new Set(products.map(p => p.categoryId))]
      const categories = await axios.post(`http://localhost:4004/api/category/bulk`,
        {
          ids: categoryIds
        }, {
        headers: {
          "x-internal-key": process.env.INTERNAL_SERVICE_KEY!
        },
      }
      )

      const categoryMap = new Map(
        categories.data.map(c => [c._id.toString(), c])
      )

      const enrichProducts = products.map(p => (
        {
          ...p,
          category: categoryMap.get(p?.categoryId!.toString()) || null
        }
      ))
      return enrichProducts
    } catch (error) {
      return error;
    }
  }

  // async getProducts() {
  //   try {

  //     const filter: any = {
  //       isActive: true

  //     }
  //     //  if()


  //     const products = await ProductModel.find(filter).populate("brandId").lean();
  //     console.log(products);
  //     const categorIds = [...new Set(products.map(p => p.categoryId))]
  //     console.log("categorIds: ", categorIds);
  //     const categories = await axios.post(`http://localhost:4004/api/category/bulk`,
  //       { ids: categorIds },
  //       {
  //         headers: {
  //           "x-internal-key": process.env.INTERNAL_SERVICE_KEY!
  //         },
  //       })
  //     console.log("categories: ", categories.data);

  //     const categoryMap = new Map(
  //       categories?.data?.map(c => [c._id.toString(), c])
  //     )
  //     console.log("categoryMap: ", categoryMap);

  //     console.log("products: ", products);

  //     const enrichedProducts = products.map(p => ({
  //       ...p,
  //       category: categoryMap.get(p?.categoryId!.toString()) || null
  //     }))

  //     console.log("enrichedProducts: ", enrichedProducts);



  //     return enrichedProducts;
  //   } catch (error) {
  //     return error;
  //   }
  // }

  async filterProducts(req: Request) {
    // const sort = ""
    const page = Number(req.query.page || 1)
    const limit = 1
    const skip = (page - 1) * limit

    try {
      const filter: any = {
        isActive: true

      }
      const q = req.query
      if (q.name) {
        filter.name = { $regex: q.name, $options: 'i' }

      }
      if (q.brand) {
        const brandName = { $regex: q.brand, $options: 'i' }
        // filter.name=brandName
        const payload: any = {
          isActive: true
        }
        payload.name = brandName
        const brandId = await brandModel.findOne(payload).lean()
        console.log("brandId: ", brandId);
        if (brandId?._id) {

          filter.brandId = brandId._id
        }
      }
      if (q.slug) {
        filter.slug = { $regex: q.slug, $options: 'i' }
      }


      console.log("filter: ", filter);

      const products = await ProductModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).populate("brandId").lean();
      console.log("products: ", products);
      const categoryIds = [...new Set(products.map(p => p.categoryId))]
      const categories = await axios.post(`http://localhost:4004/api/category/bulk`,
        {
          ids: categoryIds
        }, {
        headers: {
          "x-internal-key": process.env.INTERNAL_SERVICE_KEY!
        },
      }
      )

      const categoryMap = new Map(
        categories.data.map(c => [c._id.toString(), c])
      )

      const enrichProducts = products.map(p => (
        {
          ...p,
          category: categoryMap.get(p?.categoryId!.toString()) || null
        }
      ))
      return enrichProducts
    } catch (error) {
      return error;
    }
  }

  async deleteProduct(productId: string, sellerId: string) {
    if (!Types.ObjectId.isValid(productId)) {
      throw new HttpErrorBadRequest("Invalid product id")
    }
    try {
      const isSellerOwner = await this.isSellerOwner(sellerId, productId)
      if (!isSellerOwner) {
        throw new HttpErrorUnauthorized("You are not the owner of this product", true, "unauthorized")
      }

      const product = await ProductModel.findByIdAndUpdate({ _id: productId }, {
        $set: {
          isActive: false,
          deActivedAt: new Date()
        }
      }, { new: true })
      console.log("product: ", product);

      return product
    } catch (error) {
      console.error(error);
      throw error
    }
  }

  async isSellerOwner(sellerId: string, productId: string) {
    try {
      const product = await ProductModel.findOne({ _id: productId })
      console.log("product: ", product);
      if (product?.sellerId?.toString() === sellerId) {
        return true
      }
      return false
    } catch (error) {
      console.error(error);
      throw error
    }
  }

  async getProductVariant(variantId: string) {
    try {
      const product = await ProductModel.findOne(
        { "variants._id": variantId },
        { variants: { $elemMatch: { _id: variantId } } }
      ).lean();

      if (!product || !product.variants?.length) {
        return null;
      }

      return product.variants[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


  async updateVarient(variantId: string, variants: Variants) {
    try {
      if (!Types.ObjectId.isValid(variantId)) { }
      console.log(variantId);

      const varients = await ProductModel.findOneAndUpdate({
        "variants._id": variantId
      }, {
        $set: {
          ...(variants.price !== undefined && { "variants.$.price": variants.price }),
          ...(variants.size !== undefined && { "variants.$.size": variants.size }),
          ...(variants.color !== undefined && { "variants.$.color": variants.color }),
          ...(variants.images !== undefined && { "variants.$.images": variants.images }),
          ...(variants.stock !== undefined && { "variants.$.stock": variants.stock }),
          ...(variants.sku !== undefined && { "variants.$.sku": variants.sku }),
        }
      },
        { new: true }
      ).lean()
      console.log(varients);

      return varients
    } catch (error) {
      console.log(error);

      return error
    }
  }

  // async deleteVarient(id: string) {
  //   try {
  //     const productVarient = await ProductModel.findOneAndDelete({ _id: id }, {
  //       $set: {
  //         varient: null
  //       }
  //     }, { new: true }
  //     )
  //     console.log(productVarient);

  //     return productVarient
  //   } catch (error) {
  //     console.log(error);

  //     return error
  //   }
  // }

  async deleteImage(id: string, url: string) {
    try {

      const productVarient = await ProductModel.findOneAndUpdate({
        "variants._id": id
      }, {
        $pull: {
          "variants.$.images": { url: url }
        }
      },
        { new: true }
      )
      console.log("delected image: ", productVarient);

      return productVarient
    } catch (error) {
      console.log(error);

      return error
    }
  }
}