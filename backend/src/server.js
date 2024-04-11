import initDb from "./database/init";
import { FRONTEND_URL, IO_PORT, HTTP_PORT } from "./constants";
import { server, io } from "./database/connection";
import { createGameRoomService, startGameService, deleteGameRoomService, joinGameRoomService, leaveGameRoomService, getGameRoomsService } from "./services/games-service";
import { isRoomFull } from "./utils/isRoomFull";
import app from "./app";
import { getUserDataByIdService } from "./services/users-service";

initDb(io);
// Handle Socket.IO connections

io.on('connection', (socket) => {
  console.log(`Socket.IO client connected: ${socket.id}`);
  
  socket.on('createRoom', async  (data) => {
    const result = await createGameRoomService(data)
    .catch(err => socket.emit('createRoomResponse', err));
    socket.emit("createRoomResponse", result);
  });

  socket.on('joinRoom', async (data) => {
    try {
      const result = await joinGameRoomService({ userId: data.userId, roomId: data.roomId });
      socket.emit('joinRoomResponse', result);
    } catch (err) {
      console.error(err);
      let result = err
      socket.emit('joinRoomResponse', result);
    }
  });

  socket.on('leaveRoom', async (data) => {
    const result = await leaveGameRoomService({userId: data.userId, roomId: data.roomId})
    .catch(err => socket.emit('leaveRoomResponse', err));
    socket.emit('leaveRoomResponse', result)
  });

  socket.on('deleteRoom', async (data) => {
    const result = await deleteGameRoomService(data.roomId)
    .catch(err => socket.emit('deleteRoomResponse', err));
    socket.emit('deleteRoomResponse', result)
  });

  socket.on('startGame', async (data) => {
    console.log(data.roomId)
    const isFull = await isRoomFull(data.roomId);
    //console.log(isFull)
    if(isFull){
      const result = await startGameService(data.roomId)
      socket.emit('startGameResponse', result)
    }
    else{
      socket.emit('startGameResponse', `You don't have an opponent yet!`)
    }
  });

  socket.on('getGameRooms', async (data) =>{
    const result = await getGameRoomsService()
    socket.emit('getGameRoomsResponse', result)
  })

  socket.on('getUsername', async (data) => {
    const result = await getUserDataByIdService(data.userId)
    socket.emit('getUsernamesResponse', result)
  })

});

console.log("io", IO_PORT, "http", HTTP_PORT)
app.listen(8000, () => {
  console.log(`Server listening on ${8000}`);
});

server.listen(8001, '192.168.2.250', () => {
  console.log(`IO Server listening on  192.168.2.250:${8001}`);
});