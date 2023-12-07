import initDb from "./database/init";
import app from './app';
import { PORT } from "./constants";
import { server, io } from "./database/connection";

// Initialize the database and pass the io instance
initDb(io);

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log(`Socket.IO client connected: ${socket.id}`);

  // Handle events from Socket.IO clients if needed
  socket.on('points', (data) => {
    console.log(`Received points from client: ${data}`);
  });

  // Add more Socket.IO event handlers as needed
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});