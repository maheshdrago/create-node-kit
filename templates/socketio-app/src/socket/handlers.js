// Connected users store
const users = new Map();
const rooms = new Map();

export function setupSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Send welcome message
    socket.emit("message", {
      type: "system",
      content: "Welcome to the real-time server!",
      timestamp: new Date().toISOString(),
    });

    // Broadcast new user
    socket.broadcast.emit("user:connected", {
      userId: socket.id,
      timestamp: new Date().toISOString(),
    });

    // Handle user registration
    socket.on("user:register", (data) => {
      const { username } = data;
      users.set(socket.id, { id: socket.id, username, joinedAt: new Date() });

      io.emit("users:list", Array.from(users.values()));
      console.log(`User registered: ${username}`);
    });

    // Handle chat messages
    socket.on("message:send", (data) => {
      const user = users.get(socket.id);
      const message = {
        id: Date.now(),
        userId: socket.id,
        username: user?.username || "Anonymous",
        content: data.content,
        timestamp: new Date().toISOString(),
      };

      io.emit("message:new", message);
      console.log(`💬 Message from ${message.username}: ${data.content}`);
    });

    // Handle room creation
    socket.on("room:create", (data) => {
      const { roomName } = data;
      const roomId = `room_${Date.now()}`;

      rooms.set(roomId, {
        id: roomId,
        name: roomName,
        creator: socket.id,
        members: [socket.id],
        createdAt: new Date(),
      });

      socket.join(roomId);

      socket.emit("room:created", { roomId, roomName });
      io.emit("rooms:list", Array.from(rooms.values()));

      console.log(`Room created: ${roomName} (${roomId})`);
    });

    // Handle room joining
    socket.on("room:join", (data) => {
      const { roomId } = data;
      const room = rooms.get(roomId);

      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      socket.join(roomId);
      room.members.push(socket.id);

      socket.emit("room:joined", { roomId, roomName: room.name });
      socket.to(roomId).emit("room:user_joined", {
        userId: socket.id,
        username: users.get(socket.id)?.username || "Anonymous",
      });

      console.log(`User ${socket.id} joined room: ${room.name}`);
    });

    // Handle room leaving
    socket.on("room:leave", (data) => {
      const { roomId } = data;
      const room = rooms.get(roomId);

      if (room) {
        socket.leave(roomId);
        room.members = room.members.filter((id) => id !== socket.id);

        socket.to(roomId).emit("room:user_left", {
          userId: socket.id,
          username: users.get(socket.id)?.username || "Anonymous",
        });

        console.log(` User ${socket.id} left room: ${room.name}`);
      }
    });

    // Handle room messages
    socket.on("room:message", (data) => {
      const { roomId, content } = data;
      const user = users.get(socket.id);

      const message = {
        id: Date.now(),
        userId: socket.id,
        username: user?.username || "Anonymous",
        content,
        roomId,
        timestamp: new Date().toISOString(),
      };

      io.to(roomId).emit("room:message_new", message);
    });

    // Handle typing indicator
    socket.on("typing:start", (data) => {
      const user = users.get(socket.id);
      socket.broadcast.emit("typing:user", {
        userId: socket.id,
        username: user?.username || "Anonymous",
        isTyping: true,
      });
    });

    socket.on("typing:stop", () => {
      socket.broadcast.emit("typing:user", {
        userId: socket.id,
        isTyping: false,
      });
    });

    // Handle custom events
    socket.on("ping", () => {
      socket.emit("pong", { timestamp: new Date().toISOString() });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);

      // Clean up user
      const user = users.get(socket.id);
      users.delete(socket.id);

      // Clean up rooms
      rooms.forEach((room, roomId) => {
        if (room.members.includes(socket.id)) {
          room.members = room.members.filter((id) => id !== socket.id);
          socket.to(roomId).emit("room:user_left", {
            userId: socket.id,
            username: user?.username || "Anonymous",
          });
        }

        // Delete empty rooms
        if (room.members.length === 0) {
          rooms.delete(roomId);
        }
      });

      // Broadcast user list
      io.emit("users:list", Array.from(users.values()));
      io.emit("user:disconnected", {
        userId: socket.id,
        timestamp: new Date().toISOString(),
      });
    });
  });
}
