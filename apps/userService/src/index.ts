import App from "./app";
import connectDB from "./config/database";

const start =() => {
    const app = new App();
    connectDB();
    app.listen();
};
start();