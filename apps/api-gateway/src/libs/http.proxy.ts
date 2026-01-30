import { HttpError } from "@repose/error";
import axios from "axios";
import { NextFunction, Request, response, Response } from "express";

export const httpProxy = async (
    req: Request,
    res: Response,
    target: string,
    next: NextFunction
) => {
    // IMPORTANT: match auth service routes
    const url = `${target}${req.path}`;

    // console.log("Proxy →", req.method, url);

    try {

        const response = await axios({
            url,
            method: req.method as any,
            data: req.body,
            headers: {
                "content-type": req.headers["content-type"],
                authorization: req.headers["authorization"], // optional
                cookie: req.headers["cookie"] // optional (for refresh tokens)
            },
            timeout: 5000
        });


        if (req.path === "/login" && req.method === "POST") {

            const { accessToken, refreshToken } = response.data;
            console.log("accessToken", accessToken);
            console.log("refreshToken", refreshToken);
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 3600 * 24 * 7,
                path: "/",
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 3600 * 24 * 7,
                path: "/",
            });
            return res.status(response.status).json(response.data);
        }
        return res.status(response.status).json(response.data);
    } catch (err: any) {
        console.error("Proxy error:", err.message);

        if (err.response) {
            console.log("errorResp", err.response);

            // Downstream service error
            return next(
                new HttpError(
                    err.response.status,
                    err.response.data?.message || "Service error",
                    true,
                    err.response.data?.stack,
                    err.response.statusText,
                    err.response.data
                )
            );
        }

        return next(new HttpError(502, "Service unavailable", true));
    }
};
