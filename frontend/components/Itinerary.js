import React, {useEffect, useState} from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ip from '../ip.json';
import {Avatar, Title, Caption, TouchableRipple} from 'react-native-paper';

export default function Itinerary({
    itineraryId,
    imageUrl,
    name,
    description,
    rating,
    navigation,
    isUserProfilePage,
    creatorId
}) {
    const [totalTime, setTotalTime] = useState(null);
    const [creatorInfo, setCreatorInfo] = useState(null);
    const ratingMap = {
      0: 'No rating',
      1: '⭐',
      2: '⭐⭐',
      3: '⭐⭐⭐',
      4: '⭐⭐⭐⭐',
      5: '⭐⭐⭐⭐⭐',
    };

    useEffect(() => {
      if (!isUserProfilePage) {
        fetch(`http://${ip.ip}:8000/user/info?id=${creatorId}`, {
        credentials: 'include',
        method: 'GET',
      })
        .then(res => res.json())
        .then(resBody => {
          if (resBody.statusCode == 200) {
            setCreatorInfo({
              username: resBody.info.username,
              imageUrl: resBody.info.imageUrl,
            });
          }
        });
      }
    }, []);

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
        {(!isUserProfilePage && creatorInfo) && <View style={{
          flexDirection: 'row'
        }}>
          <TouchableOpacity>
            <Avatar.Image source={{uri: creatorInfo.imageUrl}} size={40} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Text
              style={{
                marginTop: 'auto',
                marginBottom: 'auto',
                marginLeft: 10,
                fontFamily: 'Lexend-SemiBold',
                color: 'black',
                fontSize: 17
              }}
            >
              {creatorInfo && creatorInfo.username}
            </Text>
          </TouchableOpacity>
        </View>}
        <Image 
          source={{uri: imageUrl}}
          style={{
            flex: 1,
            width: '100%',
            height: 200,
            resizeMode: 'cover',
            borderRadius: 10,
            marginTop: isUserProfilePage ? 0 : 10
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
                  fontFamily: 'Lexend-SemiBold',
                }}
              >{rating ? ratingMap[Math.floor(rating)] : 'no rating yet'}</Text>
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