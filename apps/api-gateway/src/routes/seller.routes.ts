import { Router } from "express"
import type { Response, NextFunction } from "express"
import proxy from "express-http-proxy"

const sellerRouter = Router()
const SELLER_SERVICE = process.env.SELLER_SERVICE!
sellerRouter.use(proxy(SELLER_SERVICE, {
    proxyReqPathResolver(req) {
        const newPath = req.originalUrl.replace(/^\/v1\/seller/, "/api/seller")
        return newPath
    },
    proxyReqBodyDecorator(bodyContent, srcReq) {
        return bodyContent
    },
    proxyReqOptDecorator(proxyReqOpts, srcReq:any) {
        const data = proxyReqOpts.headers["Content-Type"] = "application/json"
        proxyReqOpts.headers["x-user-id"] = srcReq.user.sub
        console.log("x-user-id",srcReq.user.sub);
        
        proxyReqOpts.headers["x-user-role"] = srcReq?.user?.role ? srcReq?.user?.role : ""

        proxyReqOpts.headers["x-user-email"] = srcReq.user.email

        // proxyReqOpts.headers["x-user-verified"] = srcReq.user.verified
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
        // const data = JSON.parse(proxyResData);
        // console.log("⬅️ user service json data:", data);
        console.log("⬅️ headers:", proxyResData.headers);
        return proxyResData
    },

    proxyErrorHandler(err: Error, res: Response, next: NextFunction) {
        console.error("❌ Proxy error:", err.message);
        res.status(500).json({
            status: 500,
            name: err.name,
            message: err.message,
            stack: err.stack,
        });
    }
}))

export default sellerRouter