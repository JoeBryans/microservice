import { Router } from "express"
import type { Response, NextFunction } from "express"
import proxy from "express-http-proxy"

const categoryRouter = Router()
const CATEGORY_SERVICE = process.env.CATEGORY_SERVICE!
categoryRouter.use(proxy(CATEGORY_SERVICE, {
    proxyReqPathResolver(req) {
        const newPath = req.originalUrl.replace(/^\/v1\/category/, "/api/category")
        console.log("➡️ Proxy path:", newPath);
        return newPath
    },
    proxyReqBodyDecorator(bodyContent, srcReq) {
        return bodyContent
    },
    proxyReqOptDecorator(proxyReqOpts, srcReq: any) {
        const data = proxyReqOpts.headers["Content-Type"] = "application/json"
        
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

export default categoryRouter