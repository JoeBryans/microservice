import e, { Router } from "express"
import proxy from "express-http-proxy"
import { Request } from "express"
const brandRouter = Router()

const BRAND_SERVICE_URL = process.env.PRODUCT_SERVICE

brandRouter.use(
    proxy(
        BRAND_SERVICE_URL!,

        {
            proxyReqPathResolver: function (req: Request) {
                const newPath = req.originalUrl.replace(/^\/v1\/brands/, "/api/brands")
                console.log("➡️ Proxy path:", newPath);
                return newPath
            }, proxyReqBodyDecorator(bodyContent, srcReq) {
                return bodyContent
            },
            proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
             
                proxyReqOpts.headers["Content-Type"] = "application/json"

                return proxyReqOpts
            },
            userResDecorator: function (proxyRes, proxyResData, userReq, userRes) {

                return proxyResData
            },

            proxyErrorHandler(err, res, next) {
                console.error("❌ Proxy error:", err.message);
                res.status(500).json({
                    status: 500,
                    name: err.name,
                    message: err.message,
                    stack: err.stack,
                });
            },
        })
)

export default brandRouter