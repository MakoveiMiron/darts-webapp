export function createRoom(socket, data, userId) {
  socket.emit("createRoom", {
    gameMode: 701,
    setCount: 7,
    legCount: 3,
    userId: userId,
  });
}

export function joinRoom(socket, data, userId) {
  socket.emit("joinRoom", {
    userId: userId,
    roomId: data.id,
    socketId: socket.id
  });
}

export function leaveRoom(socket, roomId, userId) {
  socket.emit("leaveRoom", {
    userId: userId,
    roomId: roomId,
    socketId: socket.id
  });
}

export function deleteRoom(socket, data, userId) {
  socket.emit("deleteRoom", {
    userId: userId,
    roomId: data.id,
    socketId: socket.id
  });
}

export function startGame(socket, data) {
  socket.emit("startGame", {
    roomId: data.id,
    socketId: socket.id
  });
}

export function getGameRooms(socket) {
  socket.emit("getGameRooms")
}

export function getUsernames(socket, myId, opponentId, socketId1, socketId2){
  socket.emit('getUsernames', { myId: myId, opponentId: opponentId, socketId1: socketId1, socketId2: socketId2 })
}

export function getUsername(socket, userId){
  socket.emit('getUsername', { userId: userId })
}

export function getRoomData(socket, roomId){
  socket.emit('getRoomData', roomId)
}

export function joinedToRoom(socket, userId, roomId){
  socket.emit('joinedToRoom', {userId: userId, roomId: roomId})
}

export function timerDown(socket, roomId, socketId1, socketId2){
  socket.emit('timerDown',{ roomId: roomId, socketId1: socketId1, socketId2: socketId2 })
}

export function resetTimer(socket, roomId, socketId1, socketId2){
  socket.emit('resetTimer', { roomId: roomId, socketId1: socketId1, socketId2: socketId2 })
}