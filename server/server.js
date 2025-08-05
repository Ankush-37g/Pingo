import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import http from 'http'
import { connectDB } from './lib/db.js'
import messageRouter from './routes/messageRoutes.js'
import { use } from 'react'
import { Server } from "socket.io"

// create express app and http server
const app = express()

const server = http.createServer(app)

// Create a new Socket.IO server instance and allow all origins (CORS)
// This enables clients from any domain to connect
export const io = new Server(server, {
    cors: { origin: "*" }
});

// Store mapping of userId to socketId
// Helps in tracking which user is connected to which socket
export const userSocketMap = {}; // { userId: socketId }

// Socket.IO connection handler
// This runs when a new client connects
io.on("connection", (socket) => {

    // Extract userId from the connection query parameters (sent from client)
    const userId = socket.handshake.query.userId;

    console.log("User Connected", userId); // Log the connected user

    // If userId is present, map it to the current socket's ID
    if (userId) userSocketMap[userId] = socket.id;

    // Send the updated list of online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Handle disconnection of the user
    socket.on("disconnect", () => {

        console.log("User Disconnected", userId); // Log the disconnected user

        // Remove the user from the userSocketMap
        delete userSocketMap[userId];

        // Send the updated online users list to all clients again
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});



// middlewares
app.use(express.json({limit: '4mb'}))
app.use(cors())

app.use('/api/status', (req,res)=> res.send("Server is live") );

app.use("/api/auth", userRouter)

app.use("/api/messages", messageRouter)

//connect to database
await connectDB()


const PORT = process.env.PORT || 5000;

server.listen(PORT, ()=> console.log("Server is running on PORT:" + PORT ))