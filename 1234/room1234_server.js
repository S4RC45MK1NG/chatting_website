import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

var users = {};

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    

    socket.on('message', (msg) => {
        console.log(`Received: ${msg}`);

        io.emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});