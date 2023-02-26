import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Itinerary({
    imageUrl,
    name,
    description,
    audioUrl,
    audioLength
}) {
    let secs = audioLength % 60;
    let mins = Math.floor(audioLength / 60);
    let formattedAudioLength = `${mins}:${secs}`;

    return (
        <View style={{
        backgroundColor: 'white',
        borderColor: 'white',
        borderStyle: 'solid',
        borderWidth: 1,
        borderTopColor: '#f0f2f5',
        paddingTop: 15,
        paddingHorizontal: 15,
        paddingBottom: 15
      }}>
        <Image 
          source={{uri: imageUrl}}
          style={{
            flex: 1,
            width: '100%',
            height: 200,
            resizeMode: 'contain',
            borderRadius: 10
          }}
        />
        <View style={{flexDirection: 'row'}}>
          <Text style={{
              flex: 6,
              marginTop:5 ,
              marginBottom: 5,
              fontFamily: 'Lexend-SemiBold',
              fontSize: 18,
              color: 'black',
            }}>{name}</Text>
          <TouchableOpacity style={{flex: 1, marginTop: 3, marginLeft: 'auto'}}>
            <Icon name="play-circle" color="black" size={50}/>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row'}}>
        <Icon name="clock-time-eight" color="black" size={25}/>
          <Text style={{
              marginBottom: 1,
              fontFamily: 'Lexend-SemiBold',
              fontSize: 16,
              color: 'black',
            }}> {formattedAudioLength}</Text>
        </View>
        <Text style={{
              marginTop:5,
              marginBottom: 10,
              fontFamily: 'Lexend-Regular',
              fontSize: 16,
              color: 'black',
            }}>{description}</Text>
      </View>
    )
}