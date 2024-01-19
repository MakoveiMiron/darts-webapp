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

    const socket = io("http://localhost:8001")

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

        // socket.on("getGameRoomsResponse", (resp) => {
        //     console.log("resp: ",resp)
        //     setData(resp)
        // })
        
        
        getGameRooms(socket);
              
        socket.on("getGameRoomsResponse", (resp) => {
          setData((prevData) => {
            console.log("Previous Data:", prevData);
            console.log("Updated Data:", resp);
            return resp;
          });
        });
        
        return () => {
            socket.off("serverResponse")
        };

      }, []);


    function handlePress(roomId, item){
        console.log(roomId, item)
        joinRoom(socket, item, userId)
    }
    
    function renderItem(item){
        console.log("item: ", item)
        return (
            <View style = {styles.container}>
              <View style={styles.itemContainer}>
                <Text style = {styles.itemText}>RoomId: {item.id}</Text>
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
      <View style = {styles.listContainer}>      
        <FlatList
            data = {data}
            renderItem={({item}) => renderItem(item)}
            //keyExtractor={(item) => item.id.toString()}
            numColumns={4}
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
  listContainer:{
    marginTop: 50,
    marginLeft:50,
    marginRight:50,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between", // Adjust the alignment of items within a row
    marginBottom: 10,
    marginRight: 10, // Add margin to create a gap between items in the same row
    
  },
  itemContainer: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 15, // Add border radius for rounded corners
  },
  itemText: {
    textAlign: "center",
    flex: 1,
    backgroundColor: "white",
    lineHeight: 40,
    padding: 10,
  },
  list: {
    paddingHorizontal: 10, // Adjust the horizontal padding for better spacing
    paddingVertical: 10, // Add vertical padding for spacing between rows
  },
  joinBtn:{
    textAlign:"center",
    verticalAlign: "center",
  }
});
