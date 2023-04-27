import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SoundPlayer from 'react-native-sound-player';
import { Avatar, Title, Caption, TouchableRipple } from 'react-native-paper';
import ip from '../ip.json';

export default function TravelGuide({
  currentPlayingTG,
  setCurrentPlayingTG,
  isUserProfilePage = false,
  navigation,
  travelGuide,
  closeCurrentModal,
  activateTravelGuideNav,
  enableTravelGuideNav = true,
  currentTime,
  addTravelGuide,
  itineraryMode
}) {
  let secs = Math.floor(travelGuide.audioLength % 60);
  let mins = Math.floor(travelGuide.audioLength / 60);
  let formattedAudioLength = `${mins}:${secs}`;
  const [isPaused, setPaused] = useState(false);
  const [creatorInfo, setCreatorInfo] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(0);

  function handleAudioButtonPress() {
    if (!currentPlayingTG || currentPlayingTG != travelGuide._id) {
      setPaused(false);
      setCurrentPlayingTG(travelGuide._id);
      SoundPlayer.stop();
      SoundPlayer.playUrl(travelGuide.audioUrl);
    } else if (isPaused) {
      SoundPlayer.resume();
      setPaused(false);
    } else {
      SoundPlayer.pause();
      setPaused(true);
    }
  }

  function handleNavigateTravelGuide() {
    if (closeCurrentModal) closeCurrentModal();
    if (!activateTravelGuideNav) {
      navigation.navigate('Home', {
        travelGuide: travelGuide,
        type: "travelGuideNavigation",
      });
      return;
    }

    activateTravelGuideNav(travelGuide);
  }

  useEffect(() => {
    if (!isUserProfilePage) {
      fetch(`http://${ip.ip}:8000/user/info?id=${travelGuide.creatorId}`, {
        credentials: 'include',
        method: 'GET',
      })
        .then(res => res.json())
        .then(resBody => {
          if (resBody.statusCode == 200) {
            setCreatorInfo({
              username: resBody.info.username,
              imageUrl: resBody.info.imageUrl,
              _id: resBody.info._id,
            });
          }
        });
    }
  }, []);
  if (addTravelGuide) {

    return (
      <View style={{
        width: '100%',
        backgroundColor: 'white',
        borderColor: 'white',
        borderStyle: 'solid',
        borderWidth: 1,
        borderTopColor: '#f0f2f5',
        paddingTop: 15,
        paddingBottom: 15
      }}>
        {(!isUserProfilePage && creatorInfo) && <View style={{
          width: '50%',
        }}>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('UserProfileFromHome', { ownerId: creatorInfo._id });
            }}
          >
            <Avatar.Image source={{ uri: creatorInfo.imageUrl }} size={40} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('UserProfileFromHome', { ownerId: creatorInfo._id });
            }}
          >
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
          source={{ uri: travelGuide.imageUrl }}
          style={{
            flex: 1,
            width: '100%',
            height: 200,
            resizeMode: 'cover',
            borderRadius: 10,
            marginTop: isUserProfilePage ? 0 : 10
          }}
        />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 8, marginTop: 5, marginBottom: 5 }}>
            <Text style={{
              fontFamily: 'Lexend-SemiBold',
              fontSize: 18,
              color: 'black',
            }}>{travelGuide.name}</Text>
            <View style={{
              flexDirection: 'row',
              marginTop: 5,
              maxWidth: '90%'
            }}>
              <Image
                source={require('../assets/location.png')}
                style={styles.mapicon}
              />
              <Text style={{
                marginBottom: 1,
                fontFamily: 'Lexend-SemiBold',
                fontSize: 16,
                color: 'black',
              }}>{travelGuide.locationName}</Text>
            </View>
            <View style={{
              flexDirection: 'row',
              marginTop: 5,
            }}>
              <Icon name="clock-time-eight" color="black" size={25} />
              <Text style={{
                marginBottom: 1,
                fontFamily: 'Lexend-SemiBold',
                fontSize: 16,
                color: 'black',
              }}> {formattedAudioLength}</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
  else if (itineraryMode) {
    return (
      <View style={{
        backgroundColor: 'white',
        height: '50%',
        borderColor: 'white',
        borderStyle: 'solid',
        borderWidth: 1,
        borderTopColor: '#f0f2f5',
        paddingTop: 15,
        paddingHorizontal: 15,
        paddingBottom: 15
      }}>

        <Image
          source={{ uri: travelGuide.imageUrl }}
          style={{
            flex: 1,
            width: '100%',
            height: '50%',
            borderRadius: 10,
            marginTop: isUserProfilePage ? 0 : 10
          }}
        />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 8, marginTop: 5, marginBottom: 5 }}>
            <Text style={{
              fontFamily: 'Cereal_bold',
              fontSize: 18,
              color: 'black',
            }}>{travelGuide.name}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Icon name="map-marker" color="black" size={25} />
              <Text style={{
                fontFamily: 'Cereal_Medium',
                fontSize: 16,
                color: 'black',
              }}>{travelGuide.locationName}</Text>
            </View>
          </View>
          <View style={{ flex: 2, marginTop: 5, marginBottom: 5 }}>
            <View style={{
              flexDirection: 'row',
              marginTop: 5,
              maxWidth: '90%'
            }}>
            </View>
            <View style={{
              flexDirection: 'row',
              marginTop: 5,
            }}>
              <Icon name="clock-time-eight" color="black" size={25} />
              <Text style={{
                marginBottom: 1,
                fontFamily: 'Cereal_Medium',
                fontSize: 16,
                color: 'black',
              }}> {formattedAudioLength}</Text>
            </View>
          </View>
        </View>
      </View >
    )

  }
  else {
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
        {(!isUserProfilePage && creatorInfo) &&
          <View style={{
            flexDirection: 'row',
            paddingHorizontal: 15,
          }}>
          </View>}
        <Image
          source={{ uri: travelGuide.imageUrl }}
          style={{
            flex: 1,
            width: '100%',
            height: 200,
            resizeMode: 'cover',
            borderRadius: 10,
            marginTop: isUserProfilePage ? 0 : 10
          }}
        />
        <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row' }}>
            <Icon name="map-marker" color="black" size={25} />
            <Text style={{
              fontFamily: 'Cereal_Medium',
              fontSize: 16,
              color: 'black',
            }}>{travelGuide.locationName}</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
            <Icon name="clock-time-eight" color="black" size={35} />
            <Text style={{ fontFamily: 'Cereal_Medium', fontSize: 18, color: 'black' }}>{formattedAudioLength}</Text>
          </View>
        </View>


        <View style={{ flexDirection: 'row', marginLeft: 7, justifyContent: 'space-between' }}>
          <View style={{ flex: 2, marginBottom: 5 }}>
            <Text style={{
              fontFamily: 'Cereal_bold',
              fontSize: 18,
              color: 'black',
            }}>{travelGuide.name}</Text>
            <Text style={{
              marginTop: 5,
              marginBottom: 10,
              fontFamily: 'Cereal_Medium',
              fontSize: 16,
              color: 'black',
            }}>{travelGuide.description}</Text>

          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={handleAudioButtonPress}>
              <Icon name={currentPlayingTG != travelGuide._id ? "play-circle" : isPaused ? "play-circle" : "pause-circle"} color="black" size={35} />
            </TouchableOpacity>

            {enableTravelGuideNav &&
              <TouchableOpacity onPress={handleNavigateTravelGuide}>
                <Icon name="map-marker-circle" color="black" size={35} />
              </TouchableOpacity>}
          </View>
        </View>
      </View >
    )

  }

}
const styles = {
  mapicon: {
    height: 22,
    width: 22,
  },
}