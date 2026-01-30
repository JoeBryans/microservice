import { connectToRabbitMQ } from "@repos/rabbitmq";
import { sellerModel } from "../model/seller.model";
import { SellerService } from "../service/seller.service";


const sellerService = new SellerService();

export const subscribeAuthEvents = async () => {
    const EXCHANGE_NAME = "auth.user.exchange";
    const EXCHANGE_TYPE = "topic";
    const bindings = [
        {
            routingKey: "seller.created",
            queue: "seller.created.queue"
        },
        {
            routingKey: "seller.verified-email",
            queue: "seller.verified-email.queue"
        },
    ]


    const { channel } = await connectToRabbitMQ(process.env.RABBITMQ_URL || "");
    channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, {
        durable: true
    });

    for (const { routingKey, queue } of bindings) {
        try {
            channel.assertQueue(queue, {
                durable: true
            });
            channel.bindQueue(queue, EXCHANGE_NAME, routingKey);

            let data: any;

            channel.consume(queue, async (msg) => {
                if (msg) {


                    switch (routingKey) {
                        case "seller.created":
                            data = JSON.parse(msg.content.toString());
                            console.log("data: ", data);
                            await sellerService.handleCreate(data);
                            channel.ack(msg);
                            break;

                        case "seller.verified-email":
                            data = JSON.parse(msg.content.toString());

                            const seller = await sellerModel.findOneAndUpdate({ email: data.email }, { $set: { onboardingStep: "EMAIL_VERIFIED" } }, { new: true });
                            seller?.onboardingHistory?.push({
                                step: "EMAIL_VERIFIED",
                                status: "COMPLETED",
                                reason: "",
                                timestamp: new Date(),
                            })

                            channel.ack(msg);
                            break;
                        default:
                            break;
                    }
                }
            });
        } catch (err) {
            console.error("subscribeAuthEvents error: ", err);
            throw err;
        }

    }

}