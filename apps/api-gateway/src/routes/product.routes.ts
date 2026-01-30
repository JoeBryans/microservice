import { Router } from "express";
import proxy from "express-http-proxy";
import type {Request,Response,NextFunction} from "express"

const productRouter = Router()

const PRODUCT_SERVICE = process.env.PRODUCT_SERVICE

productRouter.use(
    proxy(
        PRODUCT_SERVICE!,
        {
            proxyReqPathResolver(req:Request) {
                const newPath = req.originalUrl.replace(/^\/v1\/products/, "/api/products")

                console.log(newPath);
                

                return newPath
            },
            // proxyReqBodyDecorator(bodyContent, srcReq) {
            //     return bodyContent
            // },
            proxyReqOptDecorator(proxyReqOpts, srcReq) {
                proxyReqOpts.headers["Content-Type"] = "application/json"
                return proxyReqOpts
            },
            userResDecorator(proxyRes, proxyResData, userReq, userRes) {
                console.log(proxyRes.statusCode);

                return proxyResData
            },
             proxyErrorHandler(err: Error, res: Response, next: NextFunction) {
                       console.error("❌ Proxy error:", err.message);
                       res.status(500).json({
                           status: 500,
                           message: "Product service unavailable",
                       });
                   }
        }
    )
)



export default productRouter