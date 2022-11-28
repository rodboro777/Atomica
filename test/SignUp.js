import React from "react";
import {View, StyleSheet, Text, Image, ScrollView} from 'react-native';

import Inputs from "./Inputs";
import Submit from "./Submit";

const SignUp = props => {
    return (
        <ScrollView style={{backgroundColor: 'white'}}>
        <View style={styles.container}>
            <Image source={require('./signup.png')}
            resizeMode="center" style={styles.image} />
        <Text style={styles.textTile}>Let's Get Started</Text>
        <Text style={styles.textbody}>Create an account to access all features</Text>
        <Inputs name="Full name" icon="user"/>
        <Inputs name="Email" icon="envelope"/>
        <Inputs name="Phone" icon="phone"/>
        <Inputs name="Password" icon="lock" pass={true}/>
        <Inputs name="Confirm Password" icon="lock" pass={true}/>
        <Submit color="#0251ce" title="Create" />
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