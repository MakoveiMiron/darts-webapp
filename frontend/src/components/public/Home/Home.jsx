import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { getGameRooms, joinRoom } from "../../../../utils/socketCalls";
import "./Home.css";
import useAuth from '../../../hooks/useAuth';

export default function Home() {
  const navigate = useNavigate();
  const [roomsList, setRoomsList] = useState([]);
  const [socketConnection, setSocketConnection] = useState(false);
  const socket = useRef(io("http://192.168.2.250:8001"));


  const { user } = useAuth()
  const userId = user?.id
  console.log(userId)
  //check if loggeed in or not if yes continue if not goto login

  useEffect(() => {
    const handleRoomsListUpdate = (resp) => {
        const updatedRoomsList = resp
        setRoomsList(updatedRoomsList);
    };

    socket.current.on('roomsListUpdate', handleRoomsListUpdate);

    return () => {
        socket.current.off('roomsListUpdate', handleRoomsListUpdate);
    };
}, [roomsList]);


  useEffect(() => {
    const handleCreateRoomResponse = (resp) => {
      const newData = resp  
      setRoomsList(newData);
    };

    const handleJoinRoomResponse = (resp) => {
      console.log("2", resp)
      setSocketConnection((prevConnection) => !prevConnection);
      navigate("/game", {
        state: { userId1: resp.player1_id, userId2: resp.player2_id },
      });
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
        const roomList = resp
        setRoomsList(roomList);
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
    
  }

  function howManyJoined(item) {
    //if (item.player1_id === userId || item.player2_id === userId) return "2";
    const player1Joined = !!item.player1_id;
    const player2Joined = !!item.player2_id;

    if (player1Joined && player2Joined) {
      return "2";
    } else if (player1Joined && !player2Joined) {
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
                {howManyJoined(item) == "2" ? <p>The room is full!</p> : <button onClick={() => handlePress(item)}>Join Room</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
