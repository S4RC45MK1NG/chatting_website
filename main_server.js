import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";

import fs from "fs";
import path from "path";
import { info } from "console";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    pingTimeout: 20000,
    pingInterval: 10000
});


// Follows the struct
/*
{
    room1 : [{user1: name}, {user2: name}, ...]
    room2 : [{user1: name}, {user2: name}, ...]
}
*/
var users = {};

io.on('connection', (socket) => {
    
    const user_id = socket.id;

    console.log(`User connected: ${user_id}`);
    

    socket.on("join-info", (info) => {
        const [username, room_code] = info;
        
        // Check to create rooms if there wasn't already one
        if (room_code in users) {
            users[room_code].push({socket: user_id, username: username});
        }
        else {
            users[room_code] = [];
            users[room_code].push({socket: user_id, username: username});
        }

        socket.join(room_code);
        socket.currentRoom = room_code;
        io.to(room_code).emit("userList", users);
        console.log(`Connected ${user_id} to room ${room_code}`);
        console.log(users);
    })

    socket.on('message', (msg) => {
        console.log(`Received: ${msg}`);

        io.to(socket.currentRoom).emit('message', msg);
    });

    socket.on("media", (file) => {
        if (!file || !file.data) return;
        io.to(socket.currentRoom).emit("media", file);
    });

    socket.on('disconnect', (reason) => {
        console.log(`User disconnected: ${socket.id}`);
        const room = socket.currentRoom;
        if (!room || !users[room]) {
            console.log(`No room found for disconnected user ${socket.id}`);
            return;
        }

        users[room] = users[room].filter(u => u.socket !== socket.id);
        if (users[room].length === 0) {
            delete users[room];
        } else {
            io.to(room).emit("userList", users);
        }

        console.log(`Users in room ${room} after removal: ${JSON.stringify(users[room] || [])}`);
        console.log(`Reason: ${reason}`);
    });

});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});