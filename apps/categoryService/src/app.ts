import type { Application, Request, Response } from "express";
import express from "express";
import { ErrorHandler } from "@repose/error"
import dotenv from "dotenv"
import router from "./routes/category.routes";
dotenv.config()

export default class App {
    private readonly app: Application
    private readonly port: number
    constructor() {
        this.app = express()
        this.port = parseInt(process.env.PORT! || "4004", 10)

        this.initializeMiddlewares();
        this.initializeRoutes();
    }

    private initializeMiddlewares(): void {
        // this.app.use(helmet()); // Adds security headers
        // this.app.use(cors(
        //     {
        //         origin: "*",
        //         credentials: true,
        //         methods: ["GET", "POST", "PUT", "DELETE"],

        //         preflightContinue: false,
        //         optionsSuccessStatus: 200,

        //     }
        // ));   // Enables CORS
        // this.app.use(cookieParser());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private initializeRoutes(): void {
        this.app.get("/health", (req: Request, res: Response) => {
            res.status(200).json({ status: "up", service: "auth-service" });
        });

        this.app.use("/api/category", router);

        // Handle 404
        this.app.use((req: Request, res: Response) => {
            res.status(404).json({ message: "Route not found" });
        });

        this.app.use(ErrorHandler)

    }
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