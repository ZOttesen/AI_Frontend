import amqp, { Channel, ConsumeMessage } from 'amqplib';
import { v4 as uuidv4 } from 'uuid';
import { Message } from './utility/types'; // Importér Message-typen


const connection = await amqp.connect({
    protocol: process.env.RABBITMQ_PROTOCOL || 'amqp',
    hostname: process.env.RABBITMQ_HOST || 'localhost',
    port: Number(process.env.RABBITMQ_PORT) || 5672,
    username: process.env.RABBITMQ_USER || 'guest',
    password: process.env.RABBITMQ_PASSWORD || 'guest',
});

const createChannel = async (): Promise<Channel> => {
    const channel = await connection.createChannel();
    return channel;
};

const sendMessageToQueue = async (
    channel: Channel,
    queue: string,
    data: any,
    replyQueue: string,
    correlationId: string
): Promise<void> => {
    channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(data)), // Sørg for, at data er korrekt struktureret
        {
            replyTo: replyQueue,
            correlationId: correlationId,
        }
    );
};

const consumeReply = (channel: Channel, replyQueue: string, correlationId: string): Promise<any> => {
    return new Promise((resolve) => {
        channel.consume(
            replyQueue,
            (msg: ConsumeMessage | null) => {
                if (msg && msg.properties.correlationId === correlationId) {
                    const responseContent = JSON.parse(msg.content.toString());
                    resolve(responseContent);
                }
            },
            { noAck: true }
        );
    });
};

// Refaktorerede metoder
export const sendRequestToRabbitMQ = async (data: Message): Promise<any> => {
    if (!data.category || data.points === undefined || !data.preferences) {
        throw new Error('Invalid data: Missing category, points, or preferences');
    }

    const channel = await createChannel();
    const replyQueue = 'amq.rabbitmq.reply-to';
    const correlationId = uuidv4();

    const consumePromise = consumeReply(channel, replyQueue, correlationId);
    await sendMessageToQueue(channel, 'request_queue', data, replyQueue, correlationId);

    return consumePromise;
};

export const sendAnswerToRabbitMQ = async (data: any): Promise<any> => {
    if (!data.answer || !data.question || !data.preferences) {
        throw new Error('Invalid data: Missing answer, question, or preferences');
    }

    const channel = await createChannel();
    const replyQueue = 'amq.rabbitmq.reply-to';
    const correlationId = uuidv4();

    const consumePromise = consumeReply(channel, replyQueue, correlationId);
    await sendMessageToQueue(channel, 'request_queue', data, replyQueue, correlationId);

    return consumePromise;
};