import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import router from "./routes/seller.routes";
import { ErrorHandler } from "@repose/error";
dotenv.config();

export default class App {
    private app: express.Application;
    private port: number;

    constructor() {
        this.app = express();
        this.port = parseInt(process.env.PORT! || "4006", 10);
        this.initializeMiddleware();
        this.initializeRoutes();
    }


    private initializeMiddleware() {
        this.app.use(cors(
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
                preflightContinue: false,
                optionsSuccessStatus: 200,
            }
        ));
        this.app.use(express.json({ limit: '100mb' }));
        this.app.use(express.urlencoded({ limit: '100mb', extended: true }));
        this.app.use(helmet());
        this.app.use(cookieParser());
    }

    private initializeRoutes() {
        this.app.get("/", (req, res) => {
            res.send("Hello World!");
        });

        this.app.use("/api/seller", router)

        this.app.use(ErrorHandler)
    }


    public listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }

}

