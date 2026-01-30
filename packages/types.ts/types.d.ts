export type productsTypes={
    name: string;
    price: number;
    coverImage: string;
    varient:{
        price: number;
        sku: string;
        images: string[];
        stock: number;
        instock: boolean;
        color?: string | null | undefined;
        size?: string | null | undefined;
}
}