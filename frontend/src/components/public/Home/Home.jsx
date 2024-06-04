import { useState, useEffect, useContext } from "react";
import { WebSocketContext } from "../../../contexts/Webprovider";
import { useNavigate } from "react-router-dom";
import { getGameRooms, joinRoom, joinedToRoom } from "../../../../utils/socketCalls";
import "./Home.css";
import useAuth from '../../../hooks/useAuth';

export default function Home() {
  const navigate = useNavigate();
  const [roomsList, setRoomsList] = useState([]);
  const [joined, setJoined] = useState(false)
  const socket = useContext(WebSocketContext);

  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    const handleRoomsListUpdate = (resp) => {
      const updatedRoomsList = resp;
      setRoomsList(updatedRoomsList);
    };

    socket.on('roomsListUpdate', handleRoomsListUpdate);

    return () => {
      socket.off('roomsListUpdate', handleRoomsListUpdate);
    };
  }, [roomsList]);

  useEffect(() => {
    const handleCreateRoomResponse = (resp) => {
      const newData = resp;
      setRoomsList(newData);
    };

    const handleJoinRoomResponse = (resp) => {
      if(typeof resp === "object"){
        navigate(`/game/${resp.id}`, {
          state: { userId1: resp.player1_id, userId2: resp.player2_id, roomId: resp.id }
        });
      }
      else{
        alert(resp)
      }
    };

    const handleGetGameRoomsResponse = (resp) => {
      const roomList = resp;
      setRoomsList(roomList);
    };

    socket.on("createRoomResponse", handleCreateRoomResponse);
    socket.on("joinRoomResponse", handleJoinRoomResponse);
    socket.on("getGameRoomsResponse", handleGetGameRoomsResponse);
    

    getGameRooms(socket);

    return () => {
      socket.off("createRoomResponse", handleCreateRoomResponse);
      socket.off("joinRoomResponse", handleJoinRoomResponse);
      socket.off("getGameRoomsResponse", handleGetGameRoomsResponse);
      
    };
  }, [socket]);

  useEffect(() => {
    roomsList.forEach(async item => {
      const resp = await joinedToRoom(socket, userId, item.id);
      setJoined(prevJoined => ({
        ...prevJoined,
        [item.id]: resp
      }));
    });
  }, [roomsList, socket, userId]);

  async function handlePress(item) {
    navigate(`/game/${item.id}`,{
      state: { userId1: item.player1_id, userId2: item.player2_id, roomId: item.id }
    })
  }

 function howManyJoined(item) {
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
  
  function isJoined(item){
    const player1Joined = !!item.player1_id;
    const player2Joined = !!item.player2_id;

    if ((player1Joined && item.player1_id === userId) || (player2Joined && item.player2_id === userId)) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <div className="container">
      <div className="main">
        <div className="header">
          <h2>Rooms</h2>
          <button>Create New</button>
        </div>
        <div className="table-container">
          <table>
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
                  {isJoined(item) ? 
                      <button onClick={() => handlePress(item)}>
                        Go to Room
                      </button> 
                      : 
                      (item.player1_id && item.player2_id ? 
                        "The room is full!" 
                        : 
                        <button onClick={() => joinRoom(socket, item, userId)}>
                          Join Room
                        </button>
                      )
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
