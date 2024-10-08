import initDb from "./database/init";
import { FRONTEND_URL, IO_PORT, HTTP_PORT } from "./constants";
import { server, io } from "./database/connection";
import { createGameRoomService, startGameService, deleteGameRoomService, joinGameRoomService, getGameRoomDataService, leaveGameRoomService, getGameRoomsService, joinedToRoomService, timerDownService, resetTimerService } from "./services/games-service";
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
  const result = await getRoomUsersService({myId: data.player1_id, opponentId: data.player2_id})
   
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
    const result = await leaveGameRoomService({userId: data.userId, roomId: data.roomId, socketId: data.socketId})
    .catch(err => socket.emit('leaveRoomResponse', err));
    const updatedUsernames = await getGameRoomDataService(data.roomId);
    updateUserNamesForRoom(updatedUsernames)
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
    const result = await getRoomUsersService({myId: data.myId, opponentId: data.opponentId})
    updateUserNamesForRoom({player1_id: data.myId, player2_id: data.opponentId, socketId1: data.socketId1, socketId2: data.socketId2})
    io.to(data.socketId1).to(data.socketId2).emit("userNamesResponse",result)
  })

  socket.on('getUsername', async (data) => {
    const result = await getUserDataByIdService({userId1: data.userId1})
    socket.emit('getUsernameResponse', result)
  })

  socket.on('getRoomData', async (roomId) => {
    const result = await getGameRoomDataService(roomId)
    socket.emit('getRoomDataResponse', result)
  })

  socket.on('joinedToRoom', async (data) => {
    console.log("dataaaaaaaa",data)
    const result = await joinedToRoomService({userId:data.userId, roomId: data.roomId})
    console.log("asdadadasd",result)
    socket.emit('joinedToRoomResponse', result)
  })

  socket.on('timerDown', async (data) => {
    const result = await timerDownService({roomId: data.roomId})
    io.to(data.socketId1).emit('timerDownResponse', result);
    io.to(data.socketId2).emit('timerDownResponse', result);
  })

  socket.on('resetTimer', async (data) => {
    const result = await resetTimerService({roomId: data.roomId})
    io.to(data.socketId1).emit('resetTimerResponse', result);
    io.to(data.socketId2).emit('resetTimerResponse', result);
  })

  socket.on('uploadAvatar', upload.single('avatar'), async (data) => {
    const { userId, avatarPath } = data;
    const result = await updateUserAvatarService({ userId, avatarPath });
    io.emit('avatarUpdated', result);
  });

});

console.log("io", IO_PORT, "http", HTTP_PORT)
app.listen(8000, () => {
  console.log(`Server listening on ${8000}`);
});

server.listen(8001, '192.168.2.250', () => {
  console.log(`IO Server listening on  192.168.2.250:${8001}`);
});