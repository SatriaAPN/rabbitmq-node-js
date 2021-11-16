const express = require('express');
const app = express();
const amqp = require('amqplib');
const rabbitMqServer = 'amqp://localhost:5672';

// routers
// rabbitMq producer
app.get('/', async (req, res, next) => {
    try {
        const connection = await amqp.connect(rabbitMqServer);
        const channel = await connection.createChannel();
        const queue = 'test:testing';

        // create the queue message
        const message = {
            text: 'this is an example message'
        };

        // turn it into string
        const payload = JSON.stringify(message);

        // checking if the queue on the server are available,
        await channel.assertQueue(queue, {
            durable: true,
        });

        // send the message to the queue on the server
        console.log(`a message has been produced and sent to queue: ${queue}`);
        await channel.sendToQueue(queue, Buffer.from(payload));

        // set the timeout of the queue producer
        setTimeout(() => {
            connection.close();
        }, 1000);

        res.status(200).send('a message has been produced succesfully');
    } catch(err) {
        res.status(401).json({message: 'terjadi masalah di server'});
    }
});

// call the rabbitMq consumer
require('./consumer');

// app start listening
app.listen(3000, () => {
    console.log('server start listening at localhost:3000');
});