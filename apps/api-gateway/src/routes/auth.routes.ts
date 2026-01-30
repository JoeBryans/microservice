// api-gateway/src/router/auth.router.ts
import { Request, Router } from "express";
import proxy from "express-http-proxy";

const authRouter = Router();

const AUTH_SERVICE = process.env.AUTH_SERVICE!;

// remove /api/auth prefix

authRouter.use(
    proxy(AUTH_SERVICE, {
        proxyReqPathResolver: (req: Request) => {
            const newPath = req.originalUrl.replace(/^\/v1\/auth/, "/api/auth");
            console.log("➡️ Proxy path:", newPath);
            return newPath;
        },

        // ✅ forward request body correctly
        proxyReqBodyDecorator: (bodyContent, srcReq) => {
            return bodyContent;
        },

        proxyReqOptDecorator(proxyReqOpts, srcReq) {
            proxyReqOpts.headers["Content-Type"]="application/json"
            return proxyReqOpts
        },

        // ✅ forward cookies from auth → client
        userResHeaderDecorator(headers, userReq, userRes) {
            if (headers["set-cookie"]) {
                return {
                    ...headers,
                    "set-cookie": headers["set-cookie"],
                };
            }
            console.log("Auth service SET-COOKIE:", headers["set-cookie"]);

            
            return headers;
        },

        // ✅ forward auth service errors
        proxyErrorHandler(err, res, next) {
            console.error("Auth proxy error:", err.message);
            res.status(502).json({ message: "Auth service unavailable" });
        },
    })
);

export default authRouter;
