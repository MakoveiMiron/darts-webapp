import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Game.css"; // Import your CSS file
import { leaveRoom, getUsernames, getRoomData } from "../../../../utils/socketCalls";
import { WebSocketContext } from "../../../contexts/Webprovider";
import useAuth from '../../../hooks/useAuth';
export default function Game() {
  const location = useLocation();
  const { user } = useAuth()
  const navigate = useNavigate()
  const roomId = ((location.pathname).split("/"))[2] 
  const socket = useContext(WebSocketContext);

  const [myId, setMyId] = useState(user?.id)
  const [opponentId, setOpponentId] = useState("")
  const [currentPlayer, setCurrentPlayer] = useState("Player 1");
  const [currentSet, setCurrentSet] = useState(1);
  const [currentLeg, setCurrentLeg] = useState(1);
  const [player1Score, setPlayer1Score] = useState(501);
  const [player2Score, setPlayer2Score] = useState(501);
  const [isMyTurn, setIsMyTurn] = useState(true);
  const [countdown, setCountdown] = useState(10);
  const [opponentTime, setOpponentTime] = useState(10);
  const [enteredScore, setEnteredScore] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [myName, setMyName] = useState("");
  const [opponentName, setOpponentName] = useState("");


  useEffect(() => {
    
    getRoomData(socket, roomId)

    const handleUserNamesUpdate = async (resp) => {
      const updatedUsernames = await resp
      console.log("updated",updatedUsernames)
      if(updatedUsernames.user1.user1Id === myId){
        setMyName(updatedUsernames.user1.username1)
        setOpponentName(updatedUsernames.user2.username2)
        }
        else{
          setMyName(updatedUsernames.user2.username2)
          setOpponentName(updatedUsernames.user1.username1)
        }
      };
      
      const handleRoomDataResponse = async (resp) => {
        console.log("resp:",resp)
        console.log(`${myId} \n ${opponentId} \n ${resp.socketId1} \n ${resp.socketId2}`)
          if(myId === resp.player1_id){
            console.log("1 set")
            setOpponentId(resp.player2_id)
            console.log(myId)
            getUsernames(socket, myId, resp.player2_id, resp.socketId1, resp.socketId2)
          }
          if(myId === resp.player2_id){
            console.log("2 set")
            setOpponentId(resp.player1_id)
            console.log(myId)
            getUsernames(socket, myId, resp.player1_id, resp.socketId1, resp.socketId2)
          }
      }
      
    socket.on('userNamesUpdate', handleUserNamesUpdate);
    socket.on('getRoomDataResponse', handleRoomDataResponse)    

    return () => {
        socket.off('userNamesUpdate', handleUserNamesUpdate);
        socket.off('getRoomDataResponse', handleRoomDataResponse)
        
    };
}, [myName, opponentName]);

  const startGame = () => {
    setGameStarted(true);
  };

  const submitScore = () => {
    if (isMyTurn && enteredScore !== "") {
      const parsedScore = parseInt(enteredScore, 10);
      if (!isNaN(parsedScore)) {
        // Assuming player 1's turn
        if (currentPlayer === "Player 1") {
          setPlayer1Score(player1Score - parsedScore);
        } else {
          // Player 2's turn
          setPlayer2Score(player2Score - parsedScore);
        }
        setEnteredScore("");
        setIsMyTurn(false);
        setCountdown(10);
      } else {
        console.error("Invalid score entered. Please enter a valid number.");
      }
    }
  };

  useEffect(() => {
    if (gameStarted) {
      if (isMyTurn) {
        const countdownInterval = setInterval(() => {
          if (countdown > 0) {
            setCountdown(countdown - 1);
          } else {
            handleCountdownEnd();
          }
        }, 1000);
        return () => {
          clearInterval(countdownInterval);
        };
      } else {
        const opponentTimeInterval = setInterval(() => {
          if (opponentTime > 0) {
            setOpponentTime(opponentTime - 1);
          } else if (opponentTime === 0) {
            handleOpponentTurnEnd();
          }
        }, 1000);
        return () => {
          clearInterval(opponentTimeInterval);
        };
      }
    }
  }, [countdown, isMyTurn, opponentTime, gameStarted]);

  const handleOpponentTurnEnd = () => {
    setIsMyTurn(true);
    setCountdown(10);
    setOpponentTime(10);
  };

  const handleCountdownEnd = () => {
    setCountdown(10);
    setOpponentTime(10);
    setIsMyTurn(false);
  };

  const handleLeave = async () => {
    console.log("leave",socket, roomId, myId)
      await leaveRoom(socket, roomId, myId)
      navigate("/", { replace: true})
    }

  return (
    <div className="game-container">
      {/* Player 1 Container */}
      <div className="player-container">
        <div className="player-info">
          <p className="player-text">{myName}</p>
          <p className={`score-text ${player1Score < 100 && "low-score"}`}>
            {player1Score}
          </p>
        </div>
      </div>

      {/* Actions Container */}
      <div className="actions-container">
        <div className="indicator-container">
          <p className="indicator-text">{`${currentPlayer}'s Turn`}</p>
          <p className="indicator-text">{`Set ${currentSet}, Leg ${currentLeg}`}</p>
        </div>

        {isMyTurn && gameStarted && (
          <input
            className="input"
            placeholder="Enter Score"
            type="text"
            value={enteredScore}
            onChange={(e) => setEnteredScore(e.target.value)}
          />
        )}

        <button
          className="game-button"
          onClick={submitScore}
          disabled={!isMyTurn || !gameStarted}
        >
          Submit Score
        </button>

        <div className="countdown-container">
          {isMyTurn && (
            <p className="countdown-text">{`Countdown: ${countdown}s`}</p>
          )}
          {!isMyTurn && (
            <p className="opponent-time-text">{`Opponent's Time: ${opponentTime}s`}</p>
          )}
        </div>

        <div className="start-game-container">
          {gameStarted || isMyTurn ? (
            <button className="game-button" onClick={startGame}>
              Start Game
            </button>
          ) : null}
          <button className="leave-button" onClick={handleLeave}>
              Leave Game
            </button>
        </div>
      </div>

      {/* Player 2 Container */}
      <div className="player-container">
        <div className="player-info">
          <p className="player-text">{opponentName}</p>
          <p className={`score-text ${player2Score < 100 && "low-score"}`}>
            {player2Score}
          </p>
        </div>
      </div>
    </div>
  );
}
