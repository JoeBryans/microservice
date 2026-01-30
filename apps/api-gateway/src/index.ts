import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes";
import { authenticate } from "./libs/auth/authenticate";
import authRouter from "./routes/auth.routes";
import productRouter from "./routes/product.routes";
import sellerRouter from "./routes/seller.routes";
import { authorized } from "./libs/auth/authorized";
import shopRouter from "./routes/shop.routes";
import categoryRouter from "./routes/category.routes";
import brandRouter from "./routes/brand.routes";

dotenv.config();

const app = express();

app.use(cors(
    {
        origin: [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:3002",
            "http://localhost:3003",
            "http://localhost:3004",
            "http://localhost:3005",
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Origin", "Access-Control-Allow-Headers", "Access-Control-Allow-Methods"],


        preflightContinue: false,
        optionsSuccessStatus: 200,

    }
));
app.use(cookieParser())
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);
/**
 * ===============================
 * AUTH SERVICE PROXY
 * ===============================
 */
app.use(
    "/v1/auth",
    authRouter
);

app.use("/v1/user", authenticate, userRouter)
app.use("/v1/products", productRouter)
app.use("/v1/category", categoryRouter)
app.use("/v1/brands", brandRouter)
app.use("/v1/seller", authenticate,
    (req: any, res: any, next: any) => {
        console.log("req.use:", req.user);
        next();
    },
    sellerRouter)

app.use("/v1/shop", authenticate,
    // authorized,
    // (req: any, res: any, next: any) => {
    //     console.log("req.use:", req.user);
    //     next();
    // }
    shopRouter)

app.get("/", (_, res) => {
    res.send("API Gateway is running");
});

app.listen(process.env.PORT || 4000, () => {
    console.log(`🚀 Gateway running on port ${process.env.PORT || 5000}`);
});
