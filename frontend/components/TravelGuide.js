import React, {useEffect, useState} from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SoundPlayer from 'react-native-sound-player';

export default function TravelGuide({
    travelGuideId,
    imageUrl,
    name,
    description,
    audioUrl,
    audioLength,
    currentPlayingTG,
    setCurrentPlayingTG
}) {
    let secs = Math.floor(audioLength % 60);
    let mins = Math.floor(audioLength / 60);
    let formattedAudioLength = `${mins}:${secs}`;
    const [isPaused, setPaused] = useState(false);

    function handleAudioButtonPress() {
      if (!currentPlayingTG || currentPlayingTG != travelGuideId) {
        setPaused(false);
        setCurrentPlayingTG(travelGuideId);
        SoundPlayer.stop();
        SoundPlayer.playUrl(audioUrl);
      } else if (isPaused) {
        SoundPlayer.resume();
        setPaused(false);
      } else {
        SoundPlayer.pause();
        setPaused(true);
      }
    }

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
          <View style={{flex: 6, marginTop: 5, marginBottom: 5}}>
            <Text style={{
                fontFamily: 'Lexend-SemiBold',
                fontSize: 18,
                color: 'black',
              }}>{name}</Text>
            <View style={{flexDirection: 'row', marginTop: 5}}>
              <Icon name="clock-time-eight" color="black" size={25}/>
                <Text style={{
                    marginBottom: 1,
                    fontFamily: 'Lexend-SemiBold',
                    fontSize: 16,
                    color: 'black',
                  }}> {formattedAudioLength}</Text>
            </View>
          </View>
          <TouchableOpacity style={{flex: 1, marginTop: 3, marginLeft: 'auto'}} onPress={handleAudioButtonPress}>
            <Icon name={currentPlayingTG != travelGuideId ? "play-circle" : isPaused ? "play-circle" : "pause-circle"} color="black" size={50}/>
          </TouchableOpacity>
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