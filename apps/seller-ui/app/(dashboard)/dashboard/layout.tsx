import React from 'react'
import SideBar from '../_components/sideBar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
const layout = ({ children }: { children: React.ReactNode }) => {
    return (<SidebarProvider>
        <div className='w-full min-h-screen '>
            <div className='w-full flex gap-8'>
                <div className='max-w-max w-full flex  border-r-2'>
                    <SideBar/>
                <SidebarTrigger/>
                </div>
           <main className='flex-1'>{children}</main>
            </div>
        </div></SidebarProvider>
    )
}

export default layout