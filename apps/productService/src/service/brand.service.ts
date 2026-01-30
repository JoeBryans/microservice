import { brandModel } from "../model/brand";

export class BrandService {
    constructor() { }

    async createBrand(brand: any) {
        try {
            if (!brand.name || !brand.slug || !brand.logo) {
                throw new Error("All field are required");
            }
            const brandData = await brandModel.create(brand);
            return brandData;
        } catch (error) {
            return error;
        }
    }
    async getBrands() {
        try {
            const brands = await brandModel.find();
            return brands;
        } catch (error) {
            return error;
        }
    }

    async getBrand(id: string) {
        try {
            const brand = await brandModel.findById(id);
            return brand;
        } catch (error) {
            return error;
        }
    }    

    async updateBrand(id: string, brand: any) {
        try {
            const brandData = await brandModel.findByIdAndUpdate(id, brand, { new: true });
            return brandData;
        } catch (error) {
            return error;
        }
    }   


}