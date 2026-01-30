import jwt from "jsonwebtoken";
import { HttpErrorUnauthorized } from "@repose/error";
import { NextFunction, Request, Response } from "express";

export const authenticate = async (req: any, res: Response,
    next: NextFunction) => {
    const refreshToken = req.cookies.refresh_token;
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    const accessToken = req.cookies.access_token || token;


    console.log("token: ", token);
    console.log("refreshToken: ", refreshToken);
    console.log("accessToken: ", accessToken);
    console.log("req.headers.authorization: ", req.headers.authorization);

    if (!accessToken) {
        throw new HttpErrorUnauthorized("Access token not found", true, "unauthorized");
    }
    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!, {
            maxAge: "15m",
            ignoreExpiration: false

        }) as any;
        req.user = decoded;
        console.log(req.user);

        next();
    } catch (err) {
        console.log(err);

        throw new HttpErrorUnauthorized("Invalid access token", true, "unauthorized");
    }
};