import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { io } from 'socket.io-client';
import { getUsername } from '../utils/socketCalls';

export default function DetailsScreen({ route }) {
  const navigation = useNavigation();
  const [currentPlayer, setCurrentPlayer] = useState('Player 1');
  const [currentSet, setCurrentSet] = useState(1);
  const [currentLeg, setCurrentLeg] = useState(1);
  const [player1Score, setPlayer1Score] = useState(501);
  const [player2Score, setPlayer2Score] = useState(501);
  const [isMyTurn, setIsMyTurn] = useState(true);
  const [countdown, setCountdown] = useState(45);
  const [modalVisible, setModalVisible] = useState(false);
  const [opponentTime, setOpponentTime] = useState(45);
  const [enteredScore, setEnteredScore] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [socketConnection, setSocketConnection] = useState(false);
  const [username1, setUsername1] = useState("")
  const [username2, setUsername2] = useState("")
  const {userId1, userId2 } = route.params

  const socket = useRef(io('http://192.168.2.149:8001'));

  useEffect(() => {
    
    async function getUsernames(userId1, userId2){
        if(userId1 !== null){
            await getUsername(socket.current, userId1)
        }
        if(userId2 !== null){
            await getUsername(socket.current, userId2)
        }
    }
    getUsernames(userId1,userId2)


    const handleUsernameResponse = (resp) => {
        if(resp.id === userId1){
            setUsername1(resp.username)
        }
        if(resp.id === userId2){
            setUsername2(resp.username)
        }
    }

    socket.current.on("getUsernamesResponse", handleUsernameResponse)

    return () => {
        socket.current.off("getUsernamesResponse", handleUsernameResponse)
    }

  }, [socketConnection]);

  const startGame = () => {
    setGameStarted(true);
  };

  const submitScore = () => {
    
    if (isMyTurn && enteredScore !== '') {
      const parsedScore = parseInt(enteredScore, 10);
      if (!isNaN(parsedScore)) {
        // Assuming player 1's turn
        if (currentPlayer === 'Player 1') {
          setPlayer1Score(player1Score - parsedScore);
        } else {
          // Player 2's turn
          setPlayer2Score(player2Score - parsedScore);
        }
        setEnteredScore('');
        setIsMyTurn(false)
      } else {
        console.error('Invalid score entered. Please enter a valid number.');
      }
    }
  };

  useEffect(() => {
    if (gameStarted) {
      const interval = setInterval(() => {
        if (countdown > 0) {
          setCountdown(countdown - 1);
          if (!isMyTurn) {
            setOpponentTime(opponentTime - 1);
          }
        } else {
          setIsMyTurn(false);
          clearInterval(interval);
          setModalVisible(true);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [countdown, isMyTurn, opponentTime, gameStarted]);

  const closeModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.root}>
      <View style={styles.indicatorContainer}>
        <Text style={styles.indicatorText}>{`${currentPlayer}'s Turn`}</Text>
        <Text style={styles.indicatorText}>{`Set ${currentSet}, Leg ${currentLeg}`}</Text>
      </View>

      <View style={styles.playersContainer}>
        <View style={styles.player}>
          <Text style={styles.playerText}>{username1}</Text>
          <Text style={[styles.scoreText, player1Score < 100 && styles.lowScore]}>{player1Score}</Text>
        </View>

        <View style={styles.player}>
          <Text style={styles.playerText}>{username2}</Text>
          <Text style={[styles.scoreText, player2Score < 100 && styles.lowScore]}>{player2Score}</Text>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        {isMyTurn && gameStarted && (
          <TextInput
            style={styles.input}
            placeholder="Enter Score"
            keyboardType="numeric"
            value={enteredScore}
            onChangeText={(text) => setEnteredScore(text)}
          />
        )}
            <TouchableOpacity onPress={submitScore} disabled={!isMyTurn || !gameStarted}>
                <Text style={[styles.controlButton, isMyTurn ? styles.activeButton : styles.disabledButton]}>Submit Score</Text>
            </TouchableOpacity>
      </View>

      <View style={styles.countdownContainer}>
        {isMyTurn && <Text style={styles.countdownText}>{`Countdown: ${countdown}s`}</Text>}
        {!isMyTurn && <Text style={styles.opponentTimeText}>{`Opponent's Time: ${opponentTime}s`}</Text>}
      </View>

      <View style={styles.startGameContainer}>
        {gameStarted || isMyTurn && (
          <TouchableOpacity onPress={startGame}>
            <Text style={styles.startGameButton}>Start Game</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  indicatorContainer: {
    marginBottom: 10,
  },
  indicatorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  playersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    marginBottom: 20,
  },
  player: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  playerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scoreText: {
    fontSize: 20,
    color: '#555',
  },
  lowScore: {
    color: 'red',
  },
  controlsContainer: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  controlButton: {
    padding: 15,
    borderRadius: 8,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#3498db',
  },
  activeButton: {
    backgroundColor: '#3498db',
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  countdownContainer: {
    marginBottom: 10,
  },
  countdownText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  opponentTimeText: {
    fontSize: 16,
    color: '#555',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#3498db',
    marginTop: 20,
  },
  textStyle: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  startGameContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  startGameButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 8,
    color: '#fff',
    fontSize: 18,
  },
});
