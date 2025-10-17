import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import { setupSocketHandlers } from "./socket/handlers.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// REST API routes
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    connections: io.engine.clientsCount,
  });
});

app.get("/api/stats", (req, res) => {
  res.json({
    connectedClients: io.engine.clientsCount,
    rooms: Array.from(io.sockets.adapter.rooms.keys()),
  });
});

// Socket.io setup
setupSocketHandlers(io);

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.io is ready for connections`);
});
