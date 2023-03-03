import React, {useEffect, useState} from 'react';
import {Image, View, Text, StyleSheet} from 'react-native';

export default function ContentsForLocationHeader({
    sheetRef,
    locationName,
    locationImageUrl,

}) {
    useEffect(() => {
        sheetRef.current.snapTo(1);
    }, [])
    return (
        <View
            style={{
                width: '90%',
                marginLeft: 'auto',
                marginRight: 'auto'
            }}
        >
            <Image 
                source={{uri: locationImageUrl}}
                style={{
                    width: '100%',
                    height: 200,
                    resizeMode: 'cover',
                    borderRadius: 10,
                    marginTop: 20
            }}
            />
            <Text 
                style={{
                    fontFamily: 'Lexend-SemiBold',
                    fontSize: 18,
                    color: 'black',
                    marginTop: 5,
                    
                }}
            >
                {locationName}
            </Text>            
        </View>
    )
}