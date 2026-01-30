
import App from "./app";
import connectDB from "./config/database";
function start() {
    const app = new App();
    connectDB()
    app.listen();
}
start();