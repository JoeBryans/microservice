import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authorized = (req: any, res: Response, next: NextFunction) => {
    console.log(req.headers.authorization);
    const token = req.cookies.acess_token || req.headers.authorization;
    if (!token) {
        res.status(401).json({ message: "invalid token or no token provided" });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!,
            {
                maxAge: "15m", ignoreExpiration: false
            }
        );
        req.user = decoded;
        if (req.user?.role === "SELLER") {
            next();
        } else {
            res.status(401).json({ message: "Unauthorized" });
        }

    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Unauthorized", error });
    }
};