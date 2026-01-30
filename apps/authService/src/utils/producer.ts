import { connectToRabbitMQ } from "@repos/rabbitmq";

export async function PublishEvent(data: any, ROUTING_KEY: string) {
    console.log("ROUTING_KEY: ", ROUTING_KEY);
    try {
        const { channel } = await connectToRabbitMQ(process.env.RABBITMQ_URL || "");
        const EXCHANGE_NAME = "auth.user.exchange";
        const msg = JSON.stringify(data);
        await channel.assertExchange(EXCHANGE_NAME, "topic", {
            durable: true
        });
        console.log("msg: ", msg);
        channel.publish(EXCHANGE_NAME, ROUTING_KEY, Buffer.from(msg),
            { persistent: true }
        );
        return "success";
    } catch (err) {
        console.error("PublishEvent error: ", err);
        return err;
    }
}
