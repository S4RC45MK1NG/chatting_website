import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    pingTimeout: 20000,
    pingInterval: 10000
});

var users = {};


io.on('connection', (socket) => {
    
    const user_id = socket.id;

    console.log(`User connected: ${user_id}`);
    

    socket.on("user", (username) => {
        users[user_id] = username;
        console.log(users);
    })

    socket.on("room", (room_code) => {
        socket.join(room_code)
        socket.currentRoom = room_code;
        console.log(`Connected ${user_id} to room ${room_code}`);
    })

    socket.on('message', (msg) => {
        console.log(`Received: ${msg}`);

        io.to(socket.currentRoom).emit('message', msg);
    });

    socket.on("media", (files) => {
        console.log(`Recieved files: ${files}`);
    })

    socket.on('disconnect', (reason) => {
        console.log(`User disconnected: ${socket.id}`);
        delete users[user_id];
        console.log(`Reason: ${reason}`);
    });

});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});