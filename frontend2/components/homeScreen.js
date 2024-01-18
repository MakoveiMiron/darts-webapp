import React from "react"
import { View, Text, Button, StyleSheet } from "react-native"
import { useNavigation } from '@react-navigation/native';


export function HomeScreen({route}){
    const navigation = useNavigation()
    const message = route.params?.message || "Default message";
    
    function handlePress(){
        navigation.navigate('Details',{message:'navigated to details screen'})
    }

    return ( 
    <View style={styles.root}>
        <View style={styles.container}>
            <Text style={styles.text}>{message}</Text>
            <Button 
                onPress={() => navigation.navigate('Details', { message: "navigated to details" })}
                title="go to details screen"
            />
        </View>
    </View>
    )
}

export function DetailsScreen({route}){
    const navigation = useNavigation()
    const message = route.params?.message || "Default message";
    
    function handlePress(){
        navigation.navigate('Home',{message:'navigated to home screen'})
    }

    return ( 
    <View style={styles.root}>
        <View style={styles.container}>
            <Text style={styles.text}>{message}</Text>
            <Button 
                onPress={() => navigation.navigate('Home', { message: "navigated to home" })} 
                title="go to home screen"
            />
        </View>
    </View>
    )
}


const styles = StyleSheet.create({
    root:{
        backgroundColor:"coral",
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