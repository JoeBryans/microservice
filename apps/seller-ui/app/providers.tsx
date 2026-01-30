"use client"
import React from 'react'
import { ReduxProvider } from './ReduxProvider'
import { AuthInitializer } from '@/components/custom/useAuth'

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReduxProvider>
      <AuthInitializer />
            {children}
    </ReduxProvider>
  )
}

export default Providers