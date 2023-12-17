export function createRoom(socket, data, userId) {
    socket.emit("createRoom", {
      gameMode: 701,
      setCount: 7,
      userId: userId,
    });
  }

  export function joinRoom(socket, data, userId) {
    socket.emit("joinRoom", {
      userId: userId,
      roomId: data.roomId,
    });
  }

  export function leaveRoom(socket, data, userId) {
    socket.emit("leaveRoom", {
      userId: userId,
      roomId: data.roomId,
    });
  }

  export function deleteRoom(socket, data, userId) {
    socket.emit("deleteRoom", {
      userId: userId,
      roomId: data.roomId,
    });
  }