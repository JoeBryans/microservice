import connectDB from "./config/database";
import App from "./app";
import { Consumer } from "./utils/consumer";
import { EventSubscriber } from "./subscribe-event";
function start() {
    const app = new App();
    connectDB()
    // Consumer("seller.created");
    EventSubscriber();
    app.listen();
}
start();