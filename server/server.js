const express = require("express");
const http = require("http");
const {Server} = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
});
app.use(cors());

io.on("connection",(socket)=>{

    socket.on("message", (msg) => {
    });
    socket.emit("message", "Hello from server!");
    socket.on("joinRoom",({roomCode,name})=>{
        socket.join(roomCode);
        socket.to(roomCode).emit("message", `User ${name} joined room: ${roomCode}`);
    })
    socket.on("selectedVideo",({videoId,roomCode})=>{
        socket.to(roomCode).emit("selectedVideo",videoId);
    })
    socket.on("trigger",({data,roomCode,time})=>{
        socket.to(roomCode).emit("trigger",{data,time});
    })
})


const port = process.env.PORT || 5000;
server.listen(port,()=>{
})