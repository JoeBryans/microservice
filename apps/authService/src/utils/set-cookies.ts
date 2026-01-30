import { Response } from "express";
const isProduction = process.env.NODE_ENV === "production";
export const setCookies = (
    res: Response,
    refreshToken: string
) => {


    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        // sameSite: "none",
        // sameSite: isProduction ? "none" : "lax",
        // path: "/", // ✅ FIXED
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });
};
