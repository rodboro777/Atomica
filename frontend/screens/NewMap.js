import React, {useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {StyleSheet, SafeAreaView, View} from 'react-native';

export default function NewMap() {
    Geolocation.requestAuthorization();
    const [region, setRegion] = useState({
        latitude: 53.9854,
        longitude: -6.3945,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topView}>

            </View>
            <View>

            </View>
            <View>

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'orange',
        flex: 1,
    },
    topView: {
        backgroundColor: 'white',
        height: 150,
        width: '100%'
    }
});