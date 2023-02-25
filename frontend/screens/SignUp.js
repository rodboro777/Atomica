import React, {useState} from "react";
import {View, StyleSheet, Text, Image, ScrollView} from 'react-native';

import Inputs from "../components/Inputs";
import Submit from "../components/Submit";
import ip from "../ip";

const SignUp = props => {
    const [username, setUsername] = useState("");
    const [passwd, setPasswd] = useState("");
    const [passwdRepeat, setPasswdRepeat] = useState("");
    const [fullName, setFullName] = useState("");
    const [country, setCountry] = useState("");

   const registerLocal = async () => {


        fetch(`http://${ip.ip}:8000/auth/register`, {
                    credentials: 'include',
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      username: username,
                      password: passwd,
                      fullName: fullName,
                      country: country,
                    })

        })
        .then(res => res.json())
        .then(resBody => {
            if (resBody.statusCode == 200) {
                props.navigation.navigate('MyTabs');
            } else {
                // TODO: need a UI to handle failed registration.
                console.log("Registration failed");
            }
        })
        .catch(err => console.log(err));
   };
    return (
            <View style={styles.container}>
                <View style={styles.subContainer}>
                <Text style={styles.textTile}>Let's Get Started</Text>
                <Text style={{...styles.textBody, marginTop: 50}}>Create an account to access all features</Text>
                <Inputs name="Full name" icon="user" onChangeText={(fullName) => setFullName(fullName)}/>
                <Inputs name="Username" icon="user" onChangeText={(username) => setUsername(username)}/>
                <Inputs name="Country" icon="map-pin" onChangeText={(country) => setCountry(country)}/>
                <Inputs name="Password" icon="lock" pass={true} onChangeText={(passwd) => setPasswd(passwd)}/>
                <Inputs name="Confirm Password" icon="lock" pass={true} onChangeText={(passwdRepeat) => setPasswdRepeat(passwdRepeat)}/>
                <Submit color="black" title="Create" handleSubmit={registerLocal}/>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.textBody}>Already have an account?</Text>
                    <Text style={[styles.textBody, {color: 'black', fontFamily: 'Lexend-SemiBold'}]}
                    onPress={() => props.navigation.navigate('Home')}> Login here</Text>
                </View>
                </View>
            </View>  
        
    )
};

const styles = StyleSheet.create({
    subContainer: {
        alignItems: 'center',
        width: '100%',
        marginTop: 80,
    },
    container: {
        alignItems: 'center',
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 5,
        flex: 1,
    },
    textTile: {
        fontSize: 40,
        fontFamily: 'Lexend-SemiBold',
        marginVertical: 5,
        marginBottom: 30,
        color: 'black'
    },
    textBody: {
        fontSize: 16,
        fontFamily: 'Lexend-Regular',
        marginTop: 5
    }

});

export default SignUp;