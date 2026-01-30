"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import Link from 'next/link'

const Nav = () => {
const [search, setSearch] = React.useState<string>('');

    // const se arch = urlParams.get('search');

  return (
      <nav className='flex justify-between items-center max-w-6xl w-full h-16 mx-auto bg-white shadow-sm px-5 my-5 rounded-lg '>
          <div className='flex gap-4 items-center p-1.5 border rounded-lg '>
              <label htmlFor="search" className='sr-only'>Search</label>
              <input type="text" id="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder='search for product by name,brand...'
                  className='w-full h-full px-4 py-2 text-sm text-gray-900 placeholder-gray-500 bg-transparent border-0 focus:outline-none focus:ring-0' />
             <Link
             href={
                {
                    pathname:"/dashboard/products",
                    query:`search=${search}`,
                    
                }
             }
             >
                  <Search className='h-5 w-5'
                  />
             </Link>
          </div>
          <div className='flex gap-4 items-center'>

              <div className='flex items-center gap-2 '>

                  <Select >
                      <SelectTrigger className=' h-full px-4 py-2 text-sm text-gray-900 placeholder-gray-500 bg-transparent border-0 focus:outline-none focus:ring-0 '>
                          <SelectValue placeholder='Sort by' />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value='name'>Name</SelectItem>
                          <SelectItem value='price'>Price</SelectItem>
                          <SelectItem value='rating'>Rating</SelectItem>
                          <SelectItem value='date'>Date</SelectItem>
                      </SelectContent>

                  </Select>
              </div>

              <Link href="/dashboard/products/new">
                  <Button variant='outline'>
                      Create new
                  </Button>
              </Link>
              <Link href="/dashboard/products/all">
                  <Button variant={"secondary"}>
                      Import
                  </Button>
              </Link>
          </div>
      </nav>  )
}

export default Nav