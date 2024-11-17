import amqp from 'amqplib';
import { v4 as uuidv4 } from 'uuid'; // Importér UUID generator

const connection = await amqp.connect({
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'user',
    password: 'password'
});

export const sendRequestToRabbitMQ = async (requestPayload: { data: string }): Promise<any> => {
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
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestPayload)), {
            replyTo: replyQueue,
            correlationId: correlationId
        });
    });
};

sendRequestToRabbitMQ({ data: 'Test message' })
    .then(response => {
        console.log("Received response:", response);
    })
    .catch(error => {
        console.error("Error:", error);
    });
