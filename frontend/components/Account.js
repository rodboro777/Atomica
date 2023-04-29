import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from "react-native-elements";

const Account = props => {
    return (
        <TouchableOpacity style={[styles.container, { backgroundColor: props.color }]} onPress={() => { props.signInWithGoogle() }}>
            <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                {props.google === true ? (
                    <Image
                        source={require('../assets/google.png')}
                        style={styles.mapicon}
                    />
                ) : (
                    <Icon style={styles.accIcon} name={props.icon} />
                )}

                <Text style={styles.textTitle}>{props.title}</Text>
            </View>
        </TouchableOpacity>
    );


};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: 155,
        height: 45,
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 10,
        marginHorizontal: 10,
        marginTop: 10,
        justifyContent: 'center',
        fontFamily: 'Cereal_bold',

    },
    accIcon: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 10,
    },
    textTitle: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,

    },
    mapicon: {
        height: 22,
        width: 22,
        marginRight: 10,
    },

});

export default Account;