
import App from "./app";
import connectDB from "./config/database";
import { Consumer } from "./utils/consumer";
function start() {
    connectDB()
    // Consumer("user.created");
    Consumer("user.verified");
    const app = new App();
    app.listen();
}
start();