import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const createAccessToken = (user: any) => {
    const payload = {
        sub: user._id || user.sub,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        verified: user.verified

    }
    if (!process.env.ACCESS_TOKEN_SECRET!) {
        throw new Error("ACCESS_TOKEN_SECRET is not set");
    }
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: "15m",
    })

    return accessToken
}