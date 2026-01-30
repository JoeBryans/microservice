import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontalIcon } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Props {
    path: string,
    editPath?: string,
    id: string
    actions: string[]
}

const ActionButton = ({ path,editPath, id, actions }: Props) => {
  return (
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                  <MoreHorizontalIcon />
                  <span className="sr-only">Open menu</span>
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {
                actions.map((action: string) => (
                    <DropdownMenuItem key={action}
                    className={cn(
                        action ==="Delete" && "hover:text-red-500",
                        action ==="Edit" && "hover:text-blue-500",
                    )}
                    >
                        {action}
                    </DropdownMenuItem>
                ))
            }
           
          </DropdownMenuContent>
      </DropdownMenu>  )
}

export default ActionButton