import { App } from "./app";
import connectDB from "./config/database";

const start = async () => {
    const app = new App();
    connectDB()
    app.listen();
};
start();