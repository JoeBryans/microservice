"use client"
import LoggedUser from '@/components/custom/user'
import { Button } from '@/components/ui/button'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { RootState } from '@/hook/store'
import { Box, Calendar, Home, Inbox, LayoutDashboard, Search, Settings, ShoppingBasket } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'

const SideBar = () => {
  const auth = LoggedUser()
  const user = auth?.user
  const isAuthenticated = auth?.isAuthenticated ?? false
  const status = auth?.status
  // console.log("auth: ", auth);

  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "products",
      url: "/dashboard/products",
      icon: Box,
    },
    {
      title: "orders",
      url: "/dashboard/orders",
      icon: ShoppingBasket,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
    },
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ]
  return (
    <div className='w-full h-screen '>
      <Sidebar variant='inset'
        collapsible='icon'
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}
                    className='text-gray-700'
                  >
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>


        </SidebarContent>
        <SidebarFooter> {isAuthenticated ?
          <span className="w-full">
            {user?.name}
          </span> : <Button variant="outline" className="w-full">
            Login
          </Button>}
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}

export default SideBar