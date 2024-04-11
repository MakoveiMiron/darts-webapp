import { useState, useEffect, useRef } from "react";
import "./Game.css"; // Import your CSS file
import { getUsername } from "../../../../utils/socketCalls";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";

export default function Game() {
  const location = useLocation();
  const { userId1, userId2 } = location.state || {};

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
  const [socketConnection, setSocketConnection] = useState(false);
  const [username1, setUsername1] = useState("");
  const [username2, setUsername2] = useState("");
  const [userId_1, setUserId1] = useState(userId1);
  const [userId_2, setUserId2] = useState(userId2);

  const socket = useRef(io("http://192.168.2.250:8001"));

  useEffect(() => {
    async function getUsernames(userId1, userId2) {
      
      if (userId1 !== null) {
        getUsername(socket.current, userId1);
      }
      if (userId2 !== null) {
        getUsername(socket.current, userId2);
      }
    }

    getUsernames(userId_1, userId_2);

    const handleUsernameResponse = (resp) => {
      
      if (resp.id === userId_1) {
        setUsername1(resp.username);
      }
      if (resp.id === userId_2) {
        setUsername2(resp.username);
      }
    };

    socket.current.on("getUsernamesResponse", handleUsernameResponse);

    return () => {
      socket.current.off("getUsernamesResponse", handleUsernameResponse);
    };
  }, [socketConnection]);

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

  return (
    <div className="game-container">
      {/* Player 1 Container */}
      <div className="player-container">
        <div className="player-info">
          <p className="player-text">{username1}</p>
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
        </div>
      </div>

      {/* Player 2 Container */}
      <div className="player-container">
        <div className="player-info">
          <p className="player-text">{username2}</p>
          <p className={`score-text ${player2Score < 100 && "low-score"}`}>
            {player2Score}
          </p>
        </div>
      </div>
    </div>
  );
}
