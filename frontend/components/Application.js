import React, {useEffect, useState} from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SoundPlayer from 'react-native-sound-player';

export default function Application({
    applicationId,
    imageUrl,
    name,
    description,
    audioUrl,
    audioLength,
    currentPlayingTG,
    setCurrentPlayingTG,
    status,
    reviewerComment,
    locationName
}) {
    let secs = Math.floor(audioLength % 60);
    let mins = Math.floor(audioLength / 60);
    let formattedAudioLength = `${mins}:${secs}`;
    const [isPaused, setPaused] = useState(false);

    function handleAudioButtonPress() {
      if (!currentPlayingTG || currentPlayingTG != applicationId) {
        setPaused(false);
        setCurrentPlayingTG(applicationId);
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
              <View style={{
              flexDirection: 'row',
              marginTop: 5,
              maxWidth: '90%'
            }}>
            <Icon name="map-marker" color="black" size={25}/>
                <Text style={{
                    marginBottom: 1,
                    fontFamily: 'Lexend-SemiBold',
                    fontSize: 16,
                    color: 'black',
                  }}>{locationName}</Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 5}}>
              <Icon name="clock-time-eight" color="black" size={25}/>
                <Text style={{
                    marginBottom: 1,
                    fontFamily: 'Lexend-SemiBold',
                    fontSize: 16,
                    color: 'black',
                  }}> {formattedAudioLength}</Text>
                  <Text> | </Text>
                  <Text style={{
                    backgroundColor: status == 'pending' ? '#f2ff7d' : '#e89bb9',
                    fontFamily: 'Lexend-SemiBold',
                    fontSize: 16,
                    color: 'black'
                }}>{status}</Text>
            </View>
          </View>
          <TouchableOpacity style={{flex: 1, marginTop: 3, marginLeft: 'auto'}} onPress={handleAudioButtonPress}>
            <Icon name={currentPlayingTG != applicationId ? "play-circle" : isPaused ? "play-circle" : "pause-circle"} color="black" size={50}/>
          </TouchableOpacity>
        </View>
          <Text style={{
                marginTop:5,
                marginBottom: 10,
                fontFamily: 'Lexend-Regular',
                fontSize: 16,
                color: 'black',
              }}>{description}</Text>
            {status == 'rejected' && <Text style={{
                marginTop:5,
                marginBottom: 10,
                fontFamily: 'Lexend-SemiBold',
                fontSize: 16,
                color: 'black',
                backgroundColor: '#e89bb9',
                borderRadius: 5,
                paddingHorizontal: 5,
                paddingVertical: 5
              }}>Reviewer Comment: {reviewerComment}</Text>}
        </View>
    )
}