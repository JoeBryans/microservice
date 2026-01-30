import { SearchParamsInterface } from "@/app/(dashboard)/dashboard/products/page";

interface Product {
    name: string;
    price: string;
    brandId: string;
    description: string;
    categoryId: string;
    coverImage: string;
    slug: string;
    sellerId: string;
    shopId: string;
}

interface Varient {
    // productId: string;

    price: string;
    sku: string;
    images?: { url: string, public_id: string }[];
    stockQty: string;
    instock?: string;
    color: string;
    size: string;
}

const url_endpoint = `${process.env.NEXT_PUBLIC_API_URL}`;
export const createProduct = async (data: Product): Promise<Product | any> => {
    console.log("data: ",data);
    const price = parseInt(data.price)

    const payload = {
        name: data.name,
        price: price,
        brandId: data.brandId,
        description: data.description,
        categoryId: data.categoryId,
        coverImage: data.coverImage,
        slug: data.slug,
        sellerId: data.sellerId,
        shopId: data.shopId,
    }
    try {
        const response = await fetch(`${url_endpoint}/v1/products/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
 
         console.log("response: ", response);

        const responseData = await response.json()
        return {
            data: responseData,
            status: response.status
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const createVarient = async (data: Varient, id: string): Promise<Varient | any> => {
    const price = parseInt(data.price)

    const payload = {
        price: price,
        sku: data.sku,
        images: data.images,
        stockQty: data.stockQty,
        color: data.color,
        size: data.size,

    }
    console.log(payload);
    try {
        const response = await fetch(`${url_endpoint}/v1/products/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        const responseData = await response.json()
        return {
            data: responseData,
            status: response.status
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getProductsData = async (searchParam: SearchParamsInterface) => {
    try {
        console.log("sec", searchParam);



        const response = await fetch(`${url_endpoint}/v1/products?${searchParam?.search && `search=${searchParam.search}`
            }&${searchParam?.name && `name=${searchParam.name}`}&${searchParam?.brand && `brand=${searchParam.brand}`}&${searchParam?.slug && `slug=${searchParam.slug}`}&${searchParam?.price && `price=${searchParam.price}`}&${searchParam?.category && `category=${searchParam.category}`}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        const data = await response.json()
        return data

    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getProductVarient = async (id: string) => {
    try {
        const response = await fetch(`${url_endpoint}/v1/products/variant/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        const data = await response.json()
        return data

    } catch (error) {
        console.log(error)
        throw error
    }
}



// export const getProductsData = async () => {
//  try {
//      const response = await fetch(`${url_endpoint}/v1/products`, {
//          method: 'GET',
//          headers: {
//              'Content-Type': 'application/json',
//          },
//      })
//      const data = await response.json()
//      return data
//  } catch (error) {
//      console.log(error)
//      throw error
//  }
// }
// export const getProductData = async (id: string) => {
//  try {
//      const response = await fetch(`${url_endpoint}/v1/products/${id}`, {
//          method: 'GET',
//          headers: {
//              'Content-Type': 'application/json',
//          },
//      })
//      const data = await response.json()
//      return data
//  } catch (error) {
//      console.log(error)
//      throw error
//  }
// }
// export const updateProduct = async (id: string, data: any) => {
//  try {
//      const response = await fetch(`${url_endpoint}/v1/products/${id}`, {
//          method: 'PUT',
//          headers: {
//              'Content-Type': 'application/json',
//          },
//          body: JSON.stringify(data),
//      })
//      const data = await response.json()
//      return data
//  } catch (error) {
//      console.log(error)
//      throw error
//  }
// }
// export const deleteProduct = async (id: string) => {
//  try {
//      const response = await fetch(`${url_endpoint}/v1/products/${id}`, {
//          method: 'DELETE',
//          headers: {
//              'Content-Type': 'application/json',
//          },
//      })
//      const data = await response.json()
//      return data
//  } catch (error) {
//      console.log(error)
//      throw error
//  }
// }   