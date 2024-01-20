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
    });
  }

  export function leaveRoom(socket, data, userId) {
    socket.emit("leaveRoom", {
      userId: userId,
      roomId: data.id,
    });
  }

  export function deleteRoom(socket, data, userId) {
    socket.emit("deleteRoom", {
      userId: userId,
      roomId: data.id,
    });
  }

  export function startGame(socket, data) {
    socket.emit("startGame", {
      roomId: data.id,
    });
  }

  export function getGameRooms(socket) {
    socket.emit("getGameRooms")
  }

  export function getUsername(socket, userId){
    socket.emit('getUsername', { userId: userId })
  }