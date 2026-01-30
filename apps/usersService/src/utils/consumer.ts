import { connectToRabbitMQ } from "@repos/rabbitmq";
import UserService from "../service/user.service";
import UserProfile from "../models/user";

const userService = new UserService();

export async function Consumer(ROUTING_KEY: string) {

    console.log("ROUTING_KEY: ", ROUTING_KEY);
    const EXCHANGE_NAME = "auth.user.exchange"
    const QUEUE = "user.queue"

    const { channel } = await connectToRabbitMQ(process.env.RABBITMQ_URL!)
    await channel.assertExchange(EXCHANGE_NAME, "topic", {
        durable: true
    })
    await channel.assertQueue(QUEUE, {
        durable: true
    })

    await channel.prefetch(1)
    channel.bindQueue(QUEUE, EXCHANGE_NAME, ROUTING_KEY);
    let data: any;
    channel.consume(QUEUE, async (msg) => {
        if (msg) {
            const event = msg.fields.routingKey;

            console.log("event: ", event);

            switch (event) {
                case "user.created":
                    data = JSON.parse(msg.content.toString());
                    console.log("data: ", data);
                    await userService.handleCreate(data);
                    channel.ack(msg);

                    break;

                case "user.verified":
                     data = JSON.parse(msg.content.toString());

                    console.log("data: ", data);
                    console.log("id: ", data._id);
                    await UserProfile.findOneAndUpdate({ userId: data._id }, { verified: true });
                    channel.ack(msg);


                    break;
                default:
                    break;
            }
        }
    })



}