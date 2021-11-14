const express = require('express');
const app = express();
const amqp = require('amqplib');
const rabbitMqServer = 'amqp://localhost:5672';
const Singleton = require('./singleton');
const singleton = new Singleton();

// routers
// rabbitMq producer
app.get('/:nama', async (req, res, next) => {
    try {
        const connection = await amqp.connect(rabbitMqServer);
        const channel = await connection.createChannel();
        const queue = 'test:testing'
        const id = (Math.random() + 1).toString(36).substring(7);
        const { nama } = req.params;

        // create the queue message
        const message = {
            id,
            nama,
            message: 'this is a message'
        };

        // turn it into string
        const payload = JSON.stringify(message);

        // checking if the queue on the server are available,
        await channel.assertQueue(queue, {
            durable: true,
        });

        // send the message to the queue on the server
        await channel.sendToQueue(queue, Buffer.from(payload));

        setTimeout(() => {
            connection.close();
        }, 1000);

        // get the message back from the queue consumer
        let data = null;
        while(!data){
            console.log('stuck here')
            data = await singleton.searchLog(id)
            await new Promise(res => setTimeout(res, 1000));
        }

        res.status(200).send(data);
    } catch(err) {
        next(err);
    }
});

// call the rabbitMq consumer
require('./consumer');

// the error handler middleware
app.use((err, req, res, next) => {
    if(err){
        const statusCode = err.statusCode || 401;
        const message = err.message || 'terjadi masalah di server';

        res.status(statusCode).json({message: message});
    }
});

// app start listening
app.listen(3000, () => {
    console.log('server start listening at localhost:3000')
});