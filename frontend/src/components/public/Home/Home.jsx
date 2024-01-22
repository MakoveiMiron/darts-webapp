import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { getGameRooms, joinRoom } from "../../../../utils/socketCalls";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [roomsList, setRoomsList] = useState([]);
  const [userId] = useState("rw7r-lc9iYEkGQOE");
  const [socketConnection, setSocketConnection] = useState(false);
  const socket = useRef(io("http://192.168.2.149:8001"));

  useEffect(() => {
    const handleCreateRoomResponse = (newData) => {
      setRoomsList(newData);
    };

    const handleJoinRoomResponse = (resp) => {
      console.log("resp: ", resp);
      setSocketConnection((prevConnection) => !prevConnection);
    };

    const handleLeaveRoomResponse = (resp) => {
      console.log(resp);
    };

    const handleDeleteRoomResponse = (resp) => {
      console.log(resp);
    };

    const handleStartGameResponse = (resp) => {
      console.log(resp);
    };

    const handleGetGameRoomsResponse = (resp) => {
      setRoomsList(resp);
    };

    socket.current.on("createRoomResponse", handleCreateRoomResponse);
    socket.current.on("joinRoomResponse", handleJoinRoomResponse);
    socket.current.on("leaveRoomResponse", handleLeaveRoomResponse);
    socket.current.on("deleteRoomResponse", handleDeleteRoomResponse);
    socket.current.on("startGameResponse", handleStartGameResponse);
    socket.current.on("getGameRoomsResponse", handleGetGameRoomsResponse);

    getGameRooms(socket.current);

    return () => {
      socket.current.off("createRoomResponse", handleCreateRoomResponse);
      socket.current.off("joinRoomResponse", handleJoinRoomResponse);
      socket.current.off("leaveRoomResponse", handleLeaveRoomResponse);
      socket.current.off("deleteRoomResponse", handleDeleteRoomResponse);
      socket.current.off("startGameResponse", handleStartGameResponse);
      socket.current.off("getGameRoomsResponse", handleGetGameRoomsResponse);
    };
  }, [socketConnection]);

  async function handlePress(item) {
    await joinRoom(socket.current, item, userId);
    navigate("/game", {
      state: { userId1: item.player1_id, userId2: item.player2_id },
    });
  }

  function howManyJoined(item) {
    if (item.player1_id === userId || item.player2_id === userId) return "2";
    const player1Joined = !!item.player1_id;
    const player2Joined = !!item.player2_id;

    if (player1Joined && player2Joined) {
      return "2";
    } else if (player1Joined || player2Joined) {
      return "1";
    } else {
      return "0";
    }
  }

  return (
    <div>
      <h2>Rooms:</h2>
      <table id="roomTable">
        <thead>
          <tr>
            <th>Room Number</th>
            <th>Joined</th>
            <th>Gamemode</th>
            <th>Set Count</th>
            <th>Leg Count</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {roomsList.map((item, index) => (
            <tr key={index} className="roomItem">
              <td>{index + 1}</td>
              <td>{howManyJoined(item)}/2</td>
              <td>{item.game_mode}</td>
              <td>{item.sets_count}</td>
              <td>{item.legs_count}</td>
              <td>
                <button onClick={() => handlePress(item)}>Join Room</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
