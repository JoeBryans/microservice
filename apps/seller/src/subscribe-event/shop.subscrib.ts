import { connectToRabbitMQ } from "@repos/rabbitmq";
import { sellerModel } from "../model/seller.model";

export const subscribeShopEvents = async () => {
    const EXCHANGE_NAME = "shop-exchange";
    const EXCHANGE_TYPE = "topic";
    const QUEUE = "shop.created.queue";
    try {
        const { channel } = await connectToRabbitMQ(process.env.RABBITMQ_URL || "");
        channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, {
            durable: true
        });
        channel.assertQueue(QUEUE, {
            durable: true
        });
        channel.bindQueue(QUEUE, EXCHANGE_NAME, "shop.created");
        // channel.prefetch(1);
        channel.consume(QUEUE, async (msg) => {
            if (msg) {
                const event = msg.fields.routingKey;
                console.log("EVENT: ", event);

                switch (event) {
                    case "shop.created":
                        const data = JSON.parse(msg.content.toString());
                        console.log("data: ", data);
                        await sellerModel.findOneAndUpdate({ userId: data.sellerId }, { $set: { onboardingStep: "SHOP_REGISTERED" },
                            
                          $push: {
                              onboardingHistory: {
                                  step: "SHOP_REGISTERED",
                                  status: "COMPLETED",
                                  reason: "",
                                  timestamp: new Date()
                              }
                          }});
                        channel.ack(msg);
                        break;
                    default:
                        break;
                }
            }
        });
    } catch (err) {
        console.error("subscribeShopEvents error: ", err);
    }
}       