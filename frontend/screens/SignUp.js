import React, {useState} from "react";
import {View, StyleSheet, Text, Image, ScrollView} from 'react-native';

import Inputs from "../components/Inputs";
import Submit from "../components/Submit";

const SignUp = props => {

    const [email, setEmail] = useState("");
    const [passwd, setPasswd] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [passwdRepeat, setPasswdRepeat] = useState("");
    const [fullName, setFullName] = useState("");


   const registerLocal = async () => {


        fetch('http://192.168.0.94:8000/auth/register', {
                    credentials: 'include',
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      username: email,
                      password: passwd,
                    })

        })
        .then(res => res.json())
        .then(resBody => {
            if (resBody.statusCode == 200) {
                props.navigation.navigate("Map");
            } else {
                // TODO: need a UI to handle failed registration.
                console.log("Registration failed");
            }
        })
        .catch(err => console.log(err));
   };
    return (
        <ScrollView style={{backgroundColor: 'white'}}>
        <View style={styles.container}>
            <Image source={require('../assets/signup.png')}
            resizeMode="center" style={styles.image} />
        <Text style={styles.textTile}>Let's Get Started</Text>
        <Text style={styles.textbody}>Create an account to access all features</Text>
        <Inputs name="Full name" icon="user" onChangeText={(fullName) => setFullName(fullName)}/>
        <Inputs name="Email" icon="envelope" onChangeText={(email) => setEmail(email)}/>
        <Inputs name="Phone" icon="phone" onChangeText={(phoneNo) => setPhoneNo(phoneNo)}/>
        <Inputs name="Password" icon="lock" pass={true} onChangeText={(passwd) => setPasswd(passwd)}/>
        <Inputs name="Confirm Password" icon="lock" pass={true} onChangeText={(passwdRepeat) => setPasswdRepeat(passwdRepeat)}/>
        <Submit color="#0251ce" title="Create" handleSubmit={registerLocal}/>
        <View style={{flexDirection: 'row'}}>
            <Text style={styles.textBody}>Already have an account</Text>
            <Text style={[styles.textBody, {color: 'blue'}]}
            onPress={() => props.navigation.navigate('Home')}> Login here</Text>
        </View>
        </View>  
        </ScrollView>
        
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    image: {
        width: 450,
        height: 175,
        marginVertical: 10,
    },
    textTile: {
        fontSize: 40,
        fontFamily: 'Foundation',
        marginVertical: 5,
        color: 'black'
    },
    textBody: {
        fontSize: 16,
        fontFamily: 'Foundation',
        marginTop: 5
    }

});

export default SignUp;