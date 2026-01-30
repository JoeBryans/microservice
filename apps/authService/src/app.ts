import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();


import authRouter from "./router/auth.router";
import { ErrorHandler } from "@repose/error";

export default class App {
    public app: Application;
    private readonly port: number;

    constructor() {
        this.app = express();
        // Parse port safely
        this.port = parseInt(process.env.PORT || "4001", 10);

        this.initializeMiddlewares();
        this.initializeRoutes();
        // this.initializeErrorHandling();
    }

    private initializeMiddlewares(): void {
        this.app.use(helmet()); // Adds security headers
        this.app.use(cors(
            {
                origin: [
                    "http://localhost:3000",
                    "http://localhost:3001",
                    "http://localhost:3002",
                    "http://localhost:3003",
                    "http://localhost:3004",
                    "http://localhost:4000",

                ],
                credentials: true,
                methods: ["GET", "POST", "PUT", "DELETE"],

                preflightContinue: false,
                optionsSuccessStatus: 200,

            }
        ));   // Enables CORS
        this.app.use(cookieParser());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private initializeRoutes(): void {
        this.app.get("/health", (req: Request, res: Response) => {
            res.status(200).json({ status: "up", service: "auth-service" });
        });

        this.app.use("/api/auth", authRouter);

        // Handle 404
        this.app.use((req: Request, res: Response) => {
            res.status(404).json({ message: "Route not found" });
        });


        this.app.use(ErrorHandler);
    }

    // private initializeErrorHandling(): void {
    //     // Global error middleware
    //     this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    //         console.error(err.stack);
    //         res.status(500).json({ error: "Internal Server Error" });
    //     });
    // }

    public listen(): void {
        const server = this.app.listen(this.port, () => {
            console.log(`🚀 Auth service listening on port ${this.port}`);
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