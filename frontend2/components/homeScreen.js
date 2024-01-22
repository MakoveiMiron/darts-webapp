import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import io from "socket.io-client";
import { getGameRooms, joinRoom } from "../utils/socketCalls";
import { useHistory } from 'react-router-dom';

export default function HomeScreen({ route }) {
  const navigation = useNavigation();
  const [name, setName] = useState("Miron");
  const [roomsList, setRoomsList] = useState([]);
  const [userId] = useState("rw7r-lc9iYEkGQOE");
  const [socketConnection, setSocketConnection] = useState(false);
  const history = useHistory();

  const socket = useRef(io("http://192.168.2.149:8001"));

  useEffect(() => {
    const handleCreateRoomResponse = (newData) => {
      setRoomsList(newData);
    };

    const handleJoinRoomResponse = (resp) => {
      console.log("resp: ",resp);
      setSocketConnection(prevConnection => !prevConnection);
      navigation.navigate("Game",{userId1: resp.player1_id, userId2: resp.player2_id})
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
    history.push('/game', { userIds: { userId1: item.player1_id, userId2: item.player2_id } });
  }
  }

  function howManyJoined(item) {
    if(item.player1_id === userId || item.player2_id === userId) return '2';
    const player1Joined = !!item.player1_id;
    const player2Joined = !!item.player2_id;

    if (player1Joined && player2Joined) {
      return '2';
    } else if (player1Joined || player2Joined) {
      return '1';
    } else {
      return '0';
    }
  }

  function renderItem({ item, index }) {
    if (howManyJoined(item) === '2') {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.itemContainer}
      >
        <View style={styles.itemHeader}>
          <Text style={styles.roomText}>Room {index + 1}</Text>
          <Text style={styles.joinedText}>Joined {howManyJoined(item)}/2</Text>
        </View>
        <Text style={styles.itemText}>Gamemode: {item.game_mode}</Text>
        <Text style={styles.itemText}>Sets count: {item.sets_count}</Text>
        <Text style={styles.itemText}>Legs count: {item.legs_count}</Text>
        <Button
          title={"Join Room"}
          onPress={() => handlePress(item)}
          color="#3498db"
        />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Rooms:</Text>
      <View style={styles.listContainer}>
        <FlatList
          data={roomsList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#3498db",
    flex: 1,
    padding: 10,
  },
  title: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
  },
  listContainer: {
    marginTop: 20,
    flex: 1,
  },
  itemContainer: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  roomText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  joinedText: {
    fontSize: 16,
    color: "#95a5a6",
  },
  itemText: {
    textAlign: "center",
    fontSize: 16,
    color: "#34495e",
    marginBottom: 5,
  },
});
