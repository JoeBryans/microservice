import express from "express";
import type { Application } from "express";
import cors from "cors"
import router from "./routes/routes";
import {ErrorHandler} from "@repose/error"
import dotenv from "dotenv";
import brandRoutes from "./routes/brand.routes";
dotenv.config();
export class App {
    private app: Application;
    private readonly port: number;
    constructor() {
        this.app = express();
        this.port = parseInt(process.env.PORT || "4003", 10);
        this.initializeMiddlewares();
        this.initializeRoutes();
    }
    private initializeMiddlewares() {
        this.app.use(cors())
        this.app.use(express.json());
        // this.app.use(express.urlencoded({ extended: true }));
    }
    private initializeRoutes() {
        this.app.get("/health", (req, res) => {
            res.status(200).json({ status: "up", service: "productService" });
        });
        this.app.use("/api/products", router);
        this.app.use("/api/brands", brandRoutes);

        this.app.use(ErrorHandler)
    }
    public listen() {
        const server = this.app.listen(this.port, () => {
            console.log(`🚀 Product service listening on port ${this.port}`);
        });
        // Graceful shutdown
        process.on("SIGTERM", () => {
            console.log("SIGTERM signal received: closing HTTP server");
            server.close(() => {
                console.log("HTTP server closed");
            });
        });
    }
}