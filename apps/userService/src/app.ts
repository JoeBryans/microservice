import express from "express";
import type { Application } from "express";

import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import userRouter from "./router/user.routes";

dotenv.config();

export default class App {
    private app: Application;
    private port: number;

    constructor() {
        this.app = express();
        this.port = parseInt(process.env.PORT! || "8000", 10);
        this.initializeMiddleware();
        this.initializeRoutes();
    }

    private initializeMiddleware() {
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(cookieParser());
        this.app.use(express.json({ limit: '100mb' }));
        this.app.use(express.urlencoded({ limit: '100mb', extended: true }));
    }

    private initializeRoutes() {
        this.app.get("/", (req, res) => {
            res.send("Hello World!");
        });
        this.app.use("/api/user", userRouter)

        this.app.use("*", (req, res) => {
            res.status(404).json({ message: "Route not found" });
        });
    }


    public listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }

}

