import { io } from "socket.io-client";
import { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState("");
  const socket = io("http://localhost:8000");

  useEffect(() => {
    socket.on("serverResponse", (newData) => {
      setData(newData);
    });
    return () => {
      socket.off("serverResponse");
    };
  }, [socket]);

  console.log(Object.values(data));
  function handleClick(socket) {
    socket.emit("create-room", {
      gameMode: 701,
      setCount: 7,
      userId: "rw7r-lc9iYEkGQOE",
    });
  }

  return (
    <>
      <div>
        {typeof data === "object" ? undefined : (
          <button onClick={() => handleClick(socket)}>Create Room</button>
        )}
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
