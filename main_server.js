import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    pingTimeout: 60000,
    pingInterval: 25000
});

var users = {};


io.on('connection', (socket) => {
    
    const user_id = socket.id;

    console.log(`User connected: ${user_id}`);
    

    socket.on("user", (username) => {
        users[user_id] = username;
        console.log(users);
    })

    socket.on('message', (msg) => {
        console.log(`Received: ${msg}`);

        io.emit('message', msg);
    });

    socket.on('disconnect', (reason) => {
        console.log(`User disconnected: ${socket.id}`);
        delete users[user_id];
        console.log(`Reason: ${reason}`);
    });

});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});