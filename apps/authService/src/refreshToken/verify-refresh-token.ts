
import { NextFunction, Response } from "express";
import { HttpErrorUnauthorized } from "@repose/error";
import jwt from "jsonwebtoken";

interface Token {
    sub: string;
    name: string;
    email: string;
    role: string;
    phone: string;
    verified: boolean;
    exp: number;

    iat: number;
}
export async function verifyRefreshToken(refreshToken: string, next: NextFunction): Promise<any> {
    try {
        console.log("refreshToken: ", refreshToken);
        
        if (!refreshToken) {
            throw new HttpErrorUnauthorized("Refresh token not found", true, "unauthorized");
        }
        const token = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!,{
        ignoreExpiration: false,
      });

      if (!token) {
        throw new HttpErrorUnauthorized("Invalid refresh token", true, "unauthorized");
      }

      console.log("sub",token);
      
    //   const userId = token.userId;


        // const refreshToken_key = `auth:refreshToken:${user._id}`;
        // const redis = await client.set(refreshToken_key, refreshToken, { "EX": 60 * 60 * 24 * 7 });
        // if (!user) {
        //     throw new HttpErrorUnauthorized("Refresh token not found", true, "unauthorized");
        // }
        return token;
    } catch (error) {
        console.error("verifyRefreshToken error: ", error);
        return next(error);
    }
}