const amqp = require('amqplib');
const rabbitMqServer = 'amqp://localhost:5672';
const Singleton = require('./singleton');
const singleton = new Singleton();

// rabbitMq listener
const listener = async(message) => {
    try {
        console.log('listener getting a data');
        const data = JSON.parse(message.content.toString());

        singleton.addLog(data);
        console.log(data);
        await new Promise(res => setTimeout(res, 4000));
    } catch (error) {
        console.error(error);
    }
};

// rabbitMq consumer
const consumer = async() => {
    console.log('test');
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