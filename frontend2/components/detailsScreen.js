import { React, useState} from "react"
import { View, Text, Button, StyleSheet, TextInput, Keyboard, TouchableWithoutFeedback } from "react-native"
import { useNavigation } from '@react-navigation/native';


export default function DetailsScreen({route}){
    const navigation = useNavigation()
    const { changeName } = route.params;
    const [newName, setNewName] = useState('')
    
    function handlePress(){
        changeName(newName)
        navigation.navigate('Home',{ message:`Name changed to ${newName}` })
    }

    return ( 
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.root}>
            <View style={styles.container}>
                <Text style={styles.text} >New name:</Text>
                <TextInput 
                    placeholder="e.g. Bob" 
                    style={styles.input} 
                    onChangeText={(val) => setNewName(val)}/> 
                <Button 
                    onPress={handlePress} 
                    title="set new name"
                />
            </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    root:{
        backgroundColor:"#40E0D0",
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
        marginBottom:10
    },
    input:{
        borderColor: "black",
        borderWidth: 1,
        marginBottom:10,
        padding: 5,
    }
})