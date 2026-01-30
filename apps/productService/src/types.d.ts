export type Variants= {
    price: number;
    sku: string;
    images: [
        {
            url: string;
            public_id: string;
        }
    ];
    stock: number;
    instock: boolean;
    color ?: string | null | undefined;
    size ?: string | null | undefined;
}
export type productsTypes={
    name: string;
    price: number;
    coverImage: string;
    sellerId: string;
    // userId?:string
    shopId: string;
    slug: string;
    categoryId:string;
    description:string;
    variants: Variants
    brandId:string;
}