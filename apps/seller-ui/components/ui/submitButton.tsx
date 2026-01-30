'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useFormStatus } from 'react-dom'

export default function SubmitButton({ name, isLoading, className }: { name: string, isLoading: boolean, className?: string }) {
    const status = useFormStatus()
    return (
        <Button type="submit"
        disabled={isLoading}
        className={cn("bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded", className)}>{name}{isLoading &&
            <span className=" animate-spin inline-block w-5 h-5 border-4 border-t-emerald-500 border-r-emerald-500 rounded-full" />
        }</Button>
    )
}