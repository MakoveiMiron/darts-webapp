import initDb from "./database/init";
import { PORT } from "./constants";
import { server, io } from "./database/connection";
import { createGameRoomService } from "./services/games-service";

// Initialize the database and pass the io instance
initDb(io);

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log(`Socket.IO client connected: ${socket.id}`);

  // Handle events from Socket.IO clients if needed
  socket.on('create-room', async  (data) => {
    const result = await createGameRoomService(data);
    console.log('Emitting serverResponse:', result);
    socket.emit("serverResponse", result);
  });

  // Add more Socket.IO event handlers as needed
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});