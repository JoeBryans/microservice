"use client"
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { MoreHorizontalIcon } from "lucide-react"
import React from 'react'
import SellerInfo from '@/components/custom/Seller';
import { toast } from 'sonner';
interface Props {
    products: Products[];
}
interface Category {
    name: string;
    slug: string;
    _id: string;

    isActive: boolean;
    parentId?: string;

}
interface Brand {
    name: string;
    slug: string;
    logo: string;
    _id: string;
}
interface Variants {
    price: number;
    sku: string;
    images?: { url: string, public_id: string }[];
    stockQty: string;
    instock?: string;
    color?: string | null | undefined;
    size?: string | null | undefined;
}
interface Products {
    name: string;
    price: string;
    brandId: Brand;
    description: string;
    categoryId: string;
    coverImage: string;
    slug: string;
    _id: string;
    isActive: boolean;
    variants: Variants[];
    category: Category;

}

const url_endpoint = `${process.env.NEXT_PUBLIC_API_URL}`;

const ProductCard = ({ products }: Props) => {
    const seller = SellerInfo()
    console.log("seller: ", seller);
    const handleDeleteProduct = (id: string) => async () => {
       try {
           const response = await fetch(`${url_endpoint}/v1/products/${id}`, {
               method: 'DELETE',
               headers: {
                   'Content-Type': 'application/json',
                   // 'Authorization': `Bearer ${auth?.accessToken}`,
               },
               body: JSON.stringify({
                   sellerId: seller?._id,
               }),
           })
           const data = await response.json()
           console.log("response: ", response);
           console.log("data: ", data);
           if (response.ok) {
               toast.success("Product deleted successfully")
               window.location.reload()
           }

           if (response.status === 401) {
               toast.error("This product is not yours!")
            //    window.location.reload()
           }

       } catch (error:any) {
           console.log("error: ", error);
           toast.error("Something went wrong!: ", error?.response?.data.message)    

       }

    }

    return (
        <div className='w-full max-w-4xl flex flex-col gap-4 mx-auto '>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Price</TableHead>
                        {/* <TableHead>Brand</TableHead> */}
                        <TableHead>Brand</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Varient</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>

                    {
                        products.map((product: Products) => (
                            <TableRow key={product._id}>
                                <TableCell className="font-medium">
                                    <Image src={product.coverImage} alt="coverImage" width={100} height={100} className='w-16 h-16 rounded-lg' />
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.slug}</TableCell>
                                <TableCell>{product.price}</TableCell>
                                <TableCell>{product.brandId.name}</TableCell>
                                <TableCell>{product.category.name}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="size-8">
                                                <MoreHorizontalIcon />
                                                <span className="sr-only">Open menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {
                                                product?.variants?.map((v: any) => (
                                                    <DropdownMenuGroup key={v._id}

                                                    >
                                                        <div className='max-w-sm flex items-center gap-2'>

                                                            <DropdownMenuItem>
                                                                <Image
                                                                    src={v?.images[0]?.url}
                                                                    alt="product"
                                                                    width={100}
                                                                    height={100}
                                                                />

                                                            </DropdownMenuItem>

                                                            <div>
                                                                <DropdownMenuItem>Size: {v.size.split(",").map((s: string) => (<span>{s}</span>))}</DropdownMenuItem>

                                                                <DropdownMenuItem>Color: {v.color}</DropdownMenuItem>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className='flex justify-between items-center'
                                                        >
                                                            <DropdownMenuItem>
                                                                <Link href={`/dashboard/products/variant/${v._id}`}>
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>

                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem variant="destructive">
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </div>
                                                        <DropdownMenuSeparator />
                                                    </DropdownMenuGroup>
                                                ))
                                            }
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="size-8">
                                                <MoreHorizontalIcon />
                                                <span className="sr-only">Open menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem> <Link href={`/dashboard/products/new/${product._id}`}>
                                                Add Varient
                                            </Link></DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Link href={`/dashboard/products/edit/${product._id}`}>
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={handleDeleteProduct(product._id)}
                                                variant="destructive">
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>

                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>

        </div>
    )
}

export default ProductCard





