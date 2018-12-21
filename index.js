// Import packages
const express = require("express");
const socketIO = require("socket.io");
const path = require("path");
const uuid4 = require("uuid4");
const useragent = require('express-useragent');

// Configuration
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

// Start server
const server = express()
  .use((req, res) => res.sendFile(INDEX), useragent.express())
  .listen(PORT, () => console.log("Listening on localhost:" + PORT));

// Initiatlize SocketIO
const io = socketIO(server);

const roomID = uuid4();

if(uuid4.valid(roomID)){
    console.log("UUID generated: " + roomID);
}

// Register "connection" events to the WebSocket
io.on("connection", function(socket) {
    console.log("A client has connected");
    socket.emit("connected", roomID);
    // Register "join" events, requested by a connected client
    socket.on("join", function (room) {
        // join channel provided by client
        socket.join(room)

        socket.emit("joined", "a client has connected")
        // Register "image" events, sent by the client
        socket.on("image", function(msg) {
            // Broadcast the "image" event to all other clients in the room
            socket.broadcast.to(room).emit("image", msg);
        });
    })
});