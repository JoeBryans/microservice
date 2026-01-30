import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import router from "./routes/shop.route";

dotenv.config();

export default class App {
    private app: express.Application;
    private port: number;

    constructor() {
        this.app = express();
        this.port = parseInt(process.env.PORT! || "4007", 10);
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
        this.app.use(cors(
            {
                origin: ["http://localhost:3000",
                        "http://localhost:3001",
                        "http://localhost:3002",
                        "http://localhost:3003",
                        "http://localhost:3004",
                        "http://localhost:3005",
                        "http://localhost:3006",
                ],
                methods: ["GET", "POST", "PUT", "DELETE"],
                allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
                credentials: true,
                preflightContinue: true,
                optionsSuccessStatus: 200,
            }
        ));
        this.app.use(cookieParser());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }
  
    private initializeRoutes() {
        this.app.get("/", (req, res) => {
            res.send("Hello World!");
        });

        this.app.use("/api/shop", router);
    }
 

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
  
}

