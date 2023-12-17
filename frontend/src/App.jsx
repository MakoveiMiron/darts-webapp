import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import {
  createRoom,
  joinRoom,
  leaveRoom,
  deleteRoom,
} from "../utils/socketCalls";

export default function App() {
  const [data, setData] = useState("");
  const [userId, setUserId] = useState("rw7r-lc9iYEkGQOE");
  const socket = io("http://localhost:8000");

  useEffect(() => {
    socket.on("createRoomResponse", (newData) => {
      setData(newData);
    });

    socket.on("joinRoomResponse", (resp) => {
      console.log(resp);
    });

    socket.on("leaveRoomResponse", (resp) => {
      console.log(resp);
    });

    socket.on("deleteRoomResponse", (resp) => {
      console.log(resp);
    });

    return () => {
      socket.off("serverResponse");
    };
  }, [socket]);

  return (
    <>
      <div>
        {typeof data === "object" ? undefined : (
          <button onClick={() => createRoom(socket, data, userId)}>
            Create Room
          </button>
        )}
      </div>
      <div>
        <button onClick={() => joinRoom(socket, data, userId)}>
          Join Room
        </button>
      </div>
      <div>
        <button onClick={() => leaveRoom(socket, data, userId)}>
          Leave Room ({data.roomId})
        </button>
      </div>
      <div>
        <button onClick={() => deleteRoom(socket, data, userId)}>
          Delete Room ({data.roomId})
        </button>
      </div>
      <div>
        <ul>
          {Object.values(data).map((value, index) => (
            <li key={index}>{value}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
