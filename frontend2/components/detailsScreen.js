import React from "react"
import { View, Text, Button, StyleSheet } from "react-native"
import { useNavigation } from '@react-navigation/native';


export default function DetailsScreen({route}){
    const navigation = useNavigation()
    const { message } = route.params;
    
    function handlePress(){
        navigation.navigate('Home',{message:'navigated to home screen'})
    }

    return ( 
    <View style={styles.root}>
        <View style={styles.container}>
            <Text style={styles.text}>{message}</Text>
            <Button 
                onPress={handlePress} 
                title="go to home screen"
            />
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    root:{
        backgroundColor:"turkiz",
        flex:1,
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