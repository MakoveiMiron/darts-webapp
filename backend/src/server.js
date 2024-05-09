import initDb from "./database/init";
import { FRONTEND_URL, IO_PORT, HTTP_PORT } from "./constants";
import { server, io } from "./database/connection";
import { createGameRoomService, startGameService, deleteGameRoomService, joinGameRoomService, getGameRoomDataService, leaveGameRoomService, getGameRoomsService } from "./services/games-service";
import { isRoomFull } from "./utils/isRoomFull";
import app from "./app";
import { getUserDataByIdService, getRoomUsersService } from "./services/users-service";

initDb(io);
// Handle Socket.IO connections

const updateRoomsList = async () => {
  const updatedRoomsList = await getGameRoomsService();
  io.emit('roomsListUpdate', updatedRoomsList);
};

const updateUserNamesForRoom = async (data) => {
  console.log("1-data",data)
  const result = await getRoomUsersService({userId1: data.player1_id, userId2: data.player2_id})
    io.to(data.socketId1).emit('userNamesUpdate', result);
    io.to(data.socketId2).emit('userNamesUpdate', result);
};

io.on('connection', (socket) => {
  console.log(`Socket.IO client connected: ${socket.id}`);
  
  socket.on('createRoom', async  (data) => {
    const result = await createGameRoomService(data)
    .catch(err => socket.emit('createRoomResponse', err));
    socket.emit("createRoomResponse", result);
  });

  socket.on('joinRoom', async (data) => {
    try {
      const result = await joinGameRoomService({ userId: data.userId, roomId: data.roomId, socketId: data.socketId });
      
      const updatedUsernames = await getGameRoomDataService(data.roomId);
      updateUserNamesForRoom(updatedUsernames)
      updateRoomsList();
      socket.emit('joinRoomResponse', result);
    } catch (err) {
      console.error(err);
      let result = err
      socket.emit('joinRoomResponse', result);
    }
  });

  socket.on('leaveRoom', async (data) => {
    console.log("leaveroom",data)
    const updatedUsernames = await getGameRoomDataService(data.roomId);
    updateUserNamesForRoom(updatedUsernames)
    const result = await leaveGameRoomService({userId: data.userId, roomId: data.roomId, socketId: data.socketId})
    .catch(err => socket.emit('leaveRoomResponse', err));
    updateRoomsList();
    socket.emit('leaveRoomResponse', result)
  });

  socket.on('deleteRoom', async (data) => {
    const result = await deleteGameRoomService(data.roomId)
    .catch(err => socket.emit('deleteRoomResponse', err));
    updateRoomsList();
    updateUserNamesForRoom(data.roomId);
    socket.emit('deleteRoomResponse', result)
  });

  socket.on('startGame', async (data) => {
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
    updateRoomsList();
    socket.emit('getGameRoomsResponse', result)
  })

  socket.on('getUsernames', async (data) => {
    const result = await getRoomUsersService({userId1: data.userId1, userId2: data.userId2})
    io.to(data.socketId1).to(socketId2).emit("userNamesResponse",result)
  })

  socket.on('getUsername', async (data) => {
    const result = await getUserDataByIdService({userId1: data.userId1})
    socket.emit('getUsernameResponse', result)
  })

});

console.log("io", IO_PORT, "http", HTTP_PORT)
app.listen(8000, () => {
  console.log(`Server listening on ${8000}`);
});

server.listen(8001, '192.168.2.250', () => {
  console.log(`IO Server listening on  192.168.2.250:${8001}`);
});