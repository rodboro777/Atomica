import React, {useEffect, useState} from 'react';
import {View, Image, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ip from '../ip.json';
import {Avatar, Title, Caption, TouchableRipple} from 'react-native-paper';

export default function Itinerary({
  navigation,
  isUserProfilePage,
  setCurrentBottomSheetType,
  setSelectedItinerary,
  item,
  currentBottomSheetType,
  setPrevType,
  setShowDetailIti,
  setShowDirection,
  sheetRef,
  isDetail,
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
      fetch(`http://${ip.ip}:8000/user/info?id=${item.creatorId}`, {
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
    fetch(`http://${ip.ip}:8000/itinerary/totalTime?id=${item._id}`, {
      credentials: 'include',
      method: 'GET',
    })
      .then(res => res.json())
      .then(resBody => {
        if (resBody.statusCode == 200) {
          let secs = Math.floor(resBody.totalTime % 60);
          let mins = Math.floor(resBody.totalTime / 60);
          setTotalTime(`${mins}:${secs}`);
        }
      });
  });

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderColor: 'white',
        borderStyle: 'solid',
        borderWidth: isDetail ? 0 : 1,
        borderTopColor: '#f0f2f5',
        paddingTop: 15,
        paddingHorizontal: 15,
        paddingBottom: 15,
      }}>
      {!isUserProfilePage && creatorInfo && (
        <View
          style={{
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('UserProfile', {
                origin: 'Home',
                ownerId: item.creatorId,
              });
            }}>
            <Avatar.Image source={{uri: creatorInfo.imageUrl}} size={40} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('UserProfile', {
                origin: 'Home',
                ownerId: item.creatorId,
              });
            }}>
            <Text
              style={{
                marginTop: 'auto',
                marginBottom: 'auto',
                marginLeft: 10,
                fontFamily: 'Lexend-SemiBold',
                color: 'black',
                fontSize: 17,
              }}>
              {creatorInfo && creatorInfo.username}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <Image
        source={{uri: item.imageUrl}}
        style={{
          flex: 1,
          width: '100%',
          height: 200,
          resizeMode: 'cover',
          borderRadius: 10,
          marginTop: isUserProfilePage ? 0 : 10,
        }}
      />
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 6, marginTop: 5, marginBottom: 5}}>
          <Text
            style={{
              fontFamily: 'Lexend-SemiBold',
              fontSize: 18,
              color: 'black',
            }}>
            {item.name}
          </Text>
          {totalTime && (
            <View style={{flexDirection: 'row', marginTop: 5}}>
              <Icon name="clock-time-eight" color="black" size={25} />
              <Text
                style={{
                  marginBottom: 1,
                  fontFamily: 'Lexend-SemiBold',
                  fontSize: 16,
                  color: 'black',
                }}>
                {' '}
                {totalTime}
              </Text>
              <Text style={{color: 'black'}}> | </Text>
              <Text
                style={{
                  color: 'black',
                  fontSize: 16,
                  fontFamily: 'Lexend-SemiBold',
                }}>
                {item.rating
                  ? ratingMap[Math.floor(item.rating)]
                  : 'no rating yet'}
              </Text>
            </View>
          )}
        </View>
        {!isDetail && (
          <TouchableOpacity
            style={{flex: 1, marginTop: 3, marginLeft: 'auto'}}
            onPress={() => {
              if(isUserProfilePage){
                navigation.navigate('Map', {
                  itineraryId: item._id,
                });
                return;
              }
              setCurrentBottomSheetType('contentsForItinerary');
              setSelectedItinerary(item);
              setPrevType(currentBottomSheetType);
              setShowDetailIti(true);
              setShowDirection(true);
              sheetRef.current.snapTo(1);
            }}>
            <Icon name="arrow-right-thin" color="black" size={50} />
          </TouchableOpacity>
        )}
      </View>
      <Text
        style={{
          marginTop: 5,
          marginBottom: 10,
          fontFamily: 'Lexend-Regular',
          fontSize: 16,
          color: 'black',
        }}>
        {item.description}
      </Text>
    </View>
  );
}
