import { connectToRabbitMQ } from "@repos/rabbitmq";
import { SellerService } from "../service/seller.service";
import { sellerModel } from "../model/seller.model";

const sellerService = new SellerService();

export async function Consumer(ROUTING_KEY = "seller.created") {
    try {
        const { channel } = await connectToRabbitMQ(process.env.RABBITMQ_URL || "");
        const EXCHANGE_NAME = "auth.user.exchange";
        const QUEUE = "seller.created.queue";
        channel.assertExchange(EXCHANGE_NAME, "topic", {
            durable: true
        });
        channel.prefetch(1);
        channel.assertQueue(QUEUE, {
            durable: true
        });
        channel.bindQueue(QUEUE, EXCHANGE_NAME, ROUTING_KEY);
        let data: any;
        channel.consume(QUEUE, async (msg) => {
            if (msg) {
                const event = msg.fields.routingKey;
                const exchangevent = msg.fields.exchange;
                console.log("EVENT: ",event);
                console.log("exchangevent: ", exchangevent);
                
                
                switch (event) {
                    case "seller.created":
                        data = JSON.parse(msg.content.toString());
                        console.log("data: ", data);
                        await sellerService.handleCreate(data);
                        channel.ack(msg);
                        break;

                    case "seller.verified-email":
                        data = JSON.parse(msg.content.toString());

                        await sellerModel.findOneAndUpdate({ email: data.email }, { $set: { onboardingStep: "EMAIL_VERIFIED" } }, { new: true });
                        channel.ack(msg);
                        break;

                    case "seller.bank-account-created":
                        data = msg.content.toString();
                        break;
                    default:
                        break;
                }
            }
        });

        return data
    } catch (err) {
        console.error("Consumer error: ", err);
    }
}



