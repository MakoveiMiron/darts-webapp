import {React, useState, useEffect} from "react"
import { View, Text, Button, StyleSheet, FlatList } from "react-native"
import { useNavigation } from '@react-navigation/native';
import io from "socket.io-client";
import { getGameRooms, joinRoom } from "../utils/socketCalls";


export default function HomeScreen({route}){
    const navigation = useNavigation();
    const [name, setName] = useState("Miron")
    const [data, setData] = useState("")
    const [userId] = useState("rw7r-lc9iYEkGQOE")

    const socket = io("http://192.168.2.149:8001")

    useEffect(() => {
        socket.on("createRoomResponse", (newData) => {
          setData((prevData) => {
            console.log("Previous Data:", prevData);
            console.log("New Data:", newData);
            return newData;
          });
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
    
        socket.on("startGameResponse", (resp) => {
          console.log(resp)
        });
 
        getGameRooms(socket);
              
        socket.on("getGameRoomsResponse", (resp) => {
          setData(resp);
        });
        
        return () => {
            socket.off("serverResponse")
        };

      }, []);


    function handlePress(roomId, item){
        console.log(roomId, item)
        joinRoom(socket, item, userId)
    }
    
    function howManyJoined(item) {
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
    
    function renderItem(item, idx){
        return (
            <View style = {styles.container}>
              <View style={styles.itemContainer}>
                <View style={styles.itemContainerHeader}>
                  <Text>Room {idx}</Text>
                  <Text>Joined {howManyJoined(item)}/2</Text>
                </View>
                <Text style = {styles.itemText}>Gamemode: {item.game_mode}</Text>
                <Text style = {styles.itemText}>Sets count: {item.sets_count}</Text>
                <Text style = {styles.itemText}>Legs count: {item.legs_count}</Text>
                <Button 
                  style={styles.joinBtn} 
                  title = {"join room"} 
                  onPress={() => handlePress(item.id, item)}
                />
              </View>
            </View>
        )
    }

    return ( 
    <View style={styles.root}>
      <Text style={styles.title}>Szobák:</Text>
        <View style = {styles.listContainer}>      
          <FlatList
            data = {data}
            renderItem={({item, index}) => renderItem(item, index+1)}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
    </View>
    )
}


const styles = StyleSheet.create({
  root: {
    backgroundColor: "coral",
    flex: 1,
  },
  title:{
    marginTop:20,
    textAlign:'center',
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold'
  },
  listContainer:{
    marginTop: 20,
    marginLeft:50,
    marginRight:50,
    marginBottom: 50,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginRight: 10,
    
  },
  itemContainer: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
  },
  itemText: {
    textAlign: "center",
    flex: 1,
    backgroundColor: "white",
    lineHeight: 40,
  },
  list: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  joinBtn:{
    textAlign:"center",
    verticalAlign: "center",
  },
  itemContainerHeader:{
    flex:2,
    flexDirection:"row",
    gap: 50,
    marginLeft: "auto",
    marginRight: "auto",
  }
});
