import React, {useEffect, useState} from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ip from '../ip.json';

export default function Itinerary({
    itineraryId,
    imageUrl,
    name,
    description,
    rating,
    navigation
}) {
    const [totalTime, setTotalTime] = useState(null);
    const ratingMap = {
      0: 'No rating',
      1: '⭐',
      2: '⭐⭐',
      3: '⭐⭐⭐',
      4: '⭐⭐⭐⭐',
      5: '⭐⭐⭐⭐⭐',
    };

    useEffect(() => {
      // Load total time for itinerary (by its travelguides.)
      fetch(`http://${ip.ip}:8000/itinerary/totalTime?id=${itineraryId}`, {
        credentials: 'include',
        method: 'GET'
      })
      .then(res => res.json())
      .then(resBody => {
        if (resBody.statusCode == 200) {
          let secs = Math.floor(resBody.totalTime % 60);
          let mins = Math.floor(resBody.totalTime / 60);
          setTotalTime(`${mins}:${secs}`);
        }
      })
    });

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
            resizeMode: 'cover',
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
            {totalTime && <View style={{flexDirection: 'row', marginTop: 5}}>
              <Icon name="clock-time-eight" color="black" size={25}/>
              <Text style={{
                  marginBottom: 1,
                  fontFamily: 'Lexend-SemiBold',
                  fontSize: 16,
                  color: 'black',
                }}> {totalTime}</Text>
              <Text style={{color: 'black'}}>  |  </Text>
              <Text
                style={{
                  color: 'black',
                  fontSize: 16,
                  fontFamily: 'Lexend-SemiBold'
                }}
              >{rating ? ratingMap[rating] : 'no rating yet'}</Text>
            </View>}
          </View>
          <TouchableOpacity style={{flex: 1, marginTop: 3, marginLeft: 'auto'}}>
            <Icon name="arrow-right-thin" color="black" size={50}/>
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