import {React, useState} from "react"
import { View, Text, Button, StyleSheet } from "react-native"
import { useNavigation } from '@react-navigation/native';


export default function HomeScreen({route}){
    const navigation = useNavigation();
    const [name, setName] = useState("Miron")

    function changeName(newName){
        setName(newName)
    }

    function handlePress(){
        navigation.navigate('Details', { changeName: changeName})
    }

    return ( 
    <View style={styles.root}>
        <View style={styles.container}>
            <Text style={styles.text}>{name}</Text>
            <Button 
                onPress={handlePress}
                title="change name"
            />
        </View>
    </View>
    )
}


const styles = StyleSheet.create({
    root:{
        backgroundColor:"coral",
        flex:2,
    },
    container: {
        backgroundColor:"white",
        padding:30,
        borderRadius:15,
        marginTop:30,
    },
    text:{
        textAlign: "center",
        alignContent:"center",
    }
})