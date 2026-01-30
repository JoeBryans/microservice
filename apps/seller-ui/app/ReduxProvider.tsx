"use client";
import { Provider, useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/hook/store";
import { isLoggedIn } from "@/hook/slices/authSlice";
import { useEffect } from "react";


export function ReduxProvider({ children }: { children: React.ReactNode }) {
    
    return <Provider store={store}>{children}</Provider>;
}
