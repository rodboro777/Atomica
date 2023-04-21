import React from "react";
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from "react-native-elements";

const Account = props => {
    return (
    <TouchableOpacity style={[styles.container, {backgroundColor: props.color}]} onPress={() => {props.signInWithGoogle()}}>
            <Icon style={styles.accIcon} name={props.icon}/>
            <Text style={styles.textTitle}>{props.title}</Text>
    </TouchableOpacity>
    );
    

};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: 135,
        height: 45,
        borderRadius: 5,
        marginHorizontal: 10,
        marginTop: 10
    },
    accIcon: {
        color: 'darkgreen',
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 13,
        marginHorizontal: 15,
    },
    textTitle: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,
        marginVertical: 10,
        marginHorizontal: 2,
    }

});

export default Account;