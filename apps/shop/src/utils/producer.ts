import { connectToRabbitMQ } from "@repos/rabbitmq";

export const PublishEvent = async (data: any, ROUTER_KEY: string) => {
    const EXCHANGE_NAME = "shop-exchange";
    const EXCHANGE_TYPE = "topic";
    const ROUTING_KEY = ROUTER_KEY;
    try {

        const { channel } = await connectToRabbitMQ(process.env.RABBITMQ_URL || "");
        const msg = JSON.stringify(data);
        await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, { durable: true });
        channel.publish(EXCHANGE_NAME, ROUTING_KEY, Buffer.from(msg), { persistent: true });

        return "success";
    } catch (err) {
        console.error("PublishEvent error: ", err);
        return err;
    }
}