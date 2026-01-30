import jwt from "jsonwebtoken";

export const verifyAccessToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;
        return decoded;
    } catch (err) {
        return null;
    }
};