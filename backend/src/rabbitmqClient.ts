import amqp from 'amqplib';
import { v4 as uuidv4 } from 'uuid'; // Importér UUID generator
import dotenv from 'dotenv';

const connection = await amqp.connect({
    protocol: process.env.RABBITMQ_PROTOCOL,
    hostname: process.env.RABBITMQ_HOST,
    port: Number(process.env.RABBITMQ_PORT),
    username: process.env.RABBITMQ_USER,
    password: process.env.RABBITMQ_PASSWORD,
});
export const sendRequestToRabbitMQ = async (data: string): Promise<any> => {
    const channel = await connection.createChannel();

    const replyQueue = 'amq.rabbitmq.reply-to';

    const correlationId = uuidv4();

    return new Promise((resolve, reject) => {
        channel.consume(replyQueue, (msg) => {
            if (msg && msg.properties.correlationId === correlationId) {
                const responseContent = JSON.parse(msg.content.toString());
                resolve(responseContent);
            }
        }, { noAck: true });

        const queue = 'request_queue';

        channel.sendToQueue(
            queue,
            Buffer.from(JSON.stringify({ text: data })),
            {
                replyTo: replyQueue,
                correlationId: correlationId,
            }
        );
    });
};
