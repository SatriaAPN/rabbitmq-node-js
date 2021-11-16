const amqp = require('amqplib');
const rabbitMqServer = 'amqp://localhost:5672';

// rabbitMq listener
const listener = async(message) => {
    try {
        console.log('a message has been received by the consumer');
        const data = JSON.parse(message.content.toString());
        console.log('this is the data from the message: ', data);
    } catch (error) {
        console.error(error);
    }
};

// rabbitMq consumer
const consumer = async() => {
    const connection = await amqp.connect(rabbitMqServer);
    const channel = await connection.createChannel();
    const queue = 'test:testing'

    await channel.assertQueue(queue, {
        durable: true,
    });
    
    // consumer starting
    channel.consume(queue, listener, { noAck: true });
};

consumer();