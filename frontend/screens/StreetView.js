import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,

} from 'react-native';
import StreetView from 'react-native-streetview';


export default function StreetView({ navigation, coordinates }) {

    const latitude = coordinates.latitude;
    const longitude = coordinates.longitude;

    return (
        <View style={styles.container}>
            <StreetView
                style={styles.streetView}
                allGesturesEnabled={true}
                coordinate={{
                    'latitude': latitude,
                    'longitude': longitude
                }}
                pov={{
                    tilt: parseFloat(0),
                    bearing: parseFloat(0),
                    zoom: parseInt(1)
                }}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    streetView: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});