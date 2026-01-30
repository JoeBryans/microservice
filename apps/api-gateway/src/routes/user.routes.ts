import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import proxy from "express-http-proxy";
import dotenv from "dotenv"
dotenv.config()

const userRouter = Router()

const USER_SERVICES = process.env.USER_SERVICE!
userRouter.use(proxy(
    USER_SERVICES,

    {
        proxyReqPathResolver(req: Request) {
            const newPath = req.originalUrl.replace(/^\/v1\/user/,
                "/api/user")
            console.log(newPath);

            return newPath
        },
        proxyReqOptDecorator(proxyReqOpts, srcReq) {
            proxyReqOpts.headers["Content-Type"] = "application/json"
            console.log(
                proxyReqOpts.headers["x-user-id"]

            );

            return proxyReqOpts
        },
        userResHeaderDecorator(headers, userReq, userRes) {
            if (headers["set-cookie"]) {
                userRes.setHeader("set-cookie", headers["set-cookie"]);
            }
            console.log(headers);

            return headers;
        },
        userResDecorator(proxyRes, proxyResData, userReq, userRes) {
            console.log("⬅️ user service status:", proxyRes.statusCode);
            const data = JSON.parse(proxyResData);
            console.log("⬅️ user service json data:", data);
            return proxyResData
        },
        proxyErrorHandler(err: Error, res: Response, next: NextFunction) {
            console.error("❌ Proxy error:", err.message);
            res.status(500).json({
                status: 500,
                message: "User service unavailable",
            });
        }
    }
))



export default userRouter