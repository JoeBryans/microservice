
"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { isLoggedIn } from "@/hook/slices/authSlice";

export function AuthInitializer() {
    const dispatch = useDispatch();

    useEffect(() => {
        const refresh = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/refresh_token`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!res.ok) return;

                const data = await res.json();

                dispatch(
                    isLoggedIn({
                        user: {
                            id: data.id,
                            email: data.email,
                            phone: data.phone,
                            name: data.name,
                            role: data.role,
                        },
                        accessToken: data.accessToken,
                    })
                );
            } catch (err) {
                console.error("Refresh token failed", err);
            }
        };

        refresh();
    }, [dispatch]);

    return null; // no UI
}
