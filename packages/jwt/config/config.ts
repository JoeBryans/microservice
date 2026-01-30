import dotenv from "dotenv";
dotenv.config();
export const config = {
    jwtSecret: process.env.ACCESS_TOKEN_SECRET!,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET!,
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "1h",
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
    environment: process.env.NODE_ENV,
};