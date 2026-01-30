import { Router } from "express"
import type { Response, NextFunction } from "express"
import proxy from "express-http-proxy"

const shopRouter = Router()
const SHOP_SERVICE = process.env.SHOP_SERVICE!
shopRouter.use(proxy(SHOP_SERVICE, {
    proxyReqPathResolver(req) {
        const newPath = req.originalUrl.replace(/^\/v1\/shop/, "/api/shop")
        return newPath
    },
    proxyReqBodyDecorator(bodyContent, srcReq) {
        return bodyContent
    },
    proxyReqOptDecorator(proxyReqOpts, srcReq: any) {
        const data = proxyReqOpts.headers["Content-Type"] = "application/json"
        proxyReqOpts.headers["x-user-id"] = srcReq.user.sub
        console.log("x-user-id", srcReq.user.sub);
        // proxyReqOpts.headers["x-internal-key"] = process.env.INTERNAL_SERVICE_KEY

        proxyReqOpts.headers["x-user-role"] = srcReq?.user?.role ? srcReq.user.role : ""

        proxyReqOpts.headers["x-user-email"] = srcReq.user.email

        proxyReqOpts.headers["x-user-verified"] = srcReq?.user?.verified ? srcReq.user.verified : ""
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
        console.log("⬅️ shop service status:", proxyRes.statusCode);
        // const data = JSON.parse(proxyResData);
        // console.log("⬅️ shop service json data:", data);
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

export default shopRouter