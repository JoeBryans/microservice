import amqplib from 'amqplib';
export async function connectToRabbitMQ(url: string) {
    try {
        const connection = await amqplib.connect(url);
        console.log('Connected to RabbitMQ');
        const channel = await connection.createChannel();
        // console.log("channel: ", channel);
        return { connection, channel };
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        throw error;
    }
}
