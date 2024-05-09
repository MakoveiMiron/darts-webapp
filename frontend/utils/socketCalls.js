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

export function getUsernames(socket, userId1, userId2, socketId1, socketId2){
  socket.emit('getUsernames', { userId1: userId1, userId2: userId2, socketId1: socketId1, socketId2: socketId2 })
}

export function getUsername(socket, userId){
  socket.emit('getUsername', { userId: userId })
}