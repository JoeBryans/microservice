"use client"
import { RootState } from '@/hook/store'
import { AuthState, User } from '@/hook/types'
import React from 'react'
import { useSelector } from 'react-redux'

const LoggedUser = () => {
    const { user, isAuthenticated, status,accessToken} = useSelector((state: RootState) => state.auth)
    if (isAuthenticated && status === "AUTHENTICATED") {
        return {
            user: user as User,
            accessToken: accessToken as string,
            isAuthenticated: isAuthenticated as boolean,
            status: status as string,
        } as AuthState
    }
    return null
}

export default LoggedUser