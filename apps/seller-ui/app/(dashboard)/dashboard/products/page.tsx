import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import Nav from './Nav'
import { getProductsData } from '@/actions/product'
import ProductCard from './ProductCard'

export interface SearchParamsInterface {
  name: string,
  slug: string,
  brand: string,
  category: string,
  price: string,
  search: string,

  page: number | string,
}


const page = async ({ searchParams }: { searchParams: SearchParamsInterface }) => {
  const searchParam = await searchParams
  // console.log("searchParam: ", searchParam);

  const products = await getProductsData(searchParam)
  console.log("products: ", products);
  return (
    <div className='w-full min-h-screen px-5 '>
      <Nav />

      <div className='flex flex-col gap-5 items-center justify-center w-full h-full'>
        <ProductCard products={products} />
      </div>
    </div>
  )
}

export default page