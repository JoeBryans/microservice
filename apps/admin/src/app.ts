import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

dotenv.config();

export default class App {
    private app: express.Application;
    private port: number;

    constructor() {
        this.app = express();
        this.port = parseInt(process.env.PORT! || "4005", 10);
        this.initializeMiddleware();
        this.initializeRoutes();
    }

    public getApp() {
        return this.app;
    }

    public getPort() {
        return this.port;
    }
    private initializeMiddleware() {
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(cookieParser());
    }
  
    private initializeRoutes() {
        this.app.get("/", (req, res) => {
            res.send("Hello World!");
        });
    }
 

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
  
}

