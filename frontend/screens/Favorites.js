import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import StreetView from 'react-native-streetview';

export default function Favorites({ navigation, route }) {

    // const latitude = travelGuide.coordinates.lat;
    // const longitude = travelGuide.coordinates.lng;

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                <View style={styles.buttonContainer}>
                    <Icon name="keyboard-backspace" color="white" size={30} />
                </View>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    streetView: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 10,
        zIndex: 1,
    },
    buttonContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});