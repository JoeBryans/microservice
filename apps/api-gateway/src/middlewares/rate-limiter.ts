import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import { Request, Response, NextFunction } from "express";

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    keyGenerator: (req: Request, res: Response) => {
        if (req.query.apiKey) return String(req.query.apiKey)

        const ipv6Subnet = 64 // calculate or set a fixed value here
        return ipKeyGenerator(req.ip!, ipv6Subnet)
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: true // Add a `message` property to the response
});

