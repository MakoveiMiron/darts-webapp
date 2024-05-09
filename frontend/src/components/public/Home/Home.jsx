import { useState, useEffect, useContext } from "react";
import { WebSocketContext } from "../../../contexts/Webprovider";
import { useNavigate } from "react-router-dom";
import { getGameRooms, joinRoom } from "../../../../utils/socketCalls";
import "./Home.css";
import useAuth from '../../../hooks/useAuth';

export default function Home() {
  const navigate = useNavigate();
  const [roomsList, setRoomsList] = useState([]);
  const socket = useContext(WebSocketContext);


  const { user } = useAuth()
  const userId = user?.id
  //check if loggeed in or not if yes continue if not goto login

  useEffect(() => {
    const handleRoomsListUpdate = (resp) => {
        const updatedRoomsList = resp
        setRoomsList(updatedRoomsList);
    };

    socket.on('roomsListUpdate', handleRoomsListUpdate);

    return () => {
        socket.off('roomsListUpdate', handleRoomsListUpdate);
    };
}, [roomsList]);


  useEffect(() => {
    const handleCreateRoomResponse = (resp) => {
      const newData = resp  
      setRoomsList(newData);
    };

    const handleJoinRoomResponse = (resp) => {
      console.log("2", resp)
      navigate(`/game/${resp.id}`, {
        state: { userId1: resp.player1_id, userId2: resp.player2_id, roomId: resp.id },
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

    socket.on("createRoomResponse", handleCreateRoomResponse);
    socket.on("joinRoomResponse", handleJoinRoomResponse);
    socket.on("leaveRoomResponse", handleLeaveRoomResponse);
    socket.on("deleteRoomResponse", handleDeleteRoomResponse);
    socket.on("startGameResponse", handleStartGameResponse);
    socket.on("getGameRoomsResponse", handleGetGameRoomsResponse);
    

    getGameRooms(socket);

    return () => {
      socket.off("createRoomResponse", handleCreateRoomResponse);
      socket.off("joinRoomResponse", handleJoinRoomResponse);
      socket.off("leaveRoomResponse", handleLeaveRoomResponse);
      socket.off("deleteRoomResponse", handleDeleteRoomResponse);
      socket.off("startGameResponse", handleStartGameResponse);
      socket.off("getGameRoomsResponse", handleGetGameRoomsResponse);
      
    };
  }, [socket]);

  

  async function handlePress(item) {
   await joinRoom(socket, item, userId);
    
  }

  function howManyJoined(item) {
    //if (item.player1_id === userId || item.player2_id === userId) return "2";
    const player1Joined = !!item.player1_id;
    const player2Joined = !!item.player2_id;

    if (player1Joined && player2Joined) {
      return "2";
    } else if ((player1Joined && !player2Joined) || (!player1Joined && player2Joined)) {
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
