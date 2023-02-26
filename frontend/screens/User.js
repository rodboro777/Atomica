import { View, SafeAreaView, StyleSheet, FlatList, Image, TouchableOpacity, Text } from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
    Avatar,
    Title,
    Caption,
    TouchableRipple,
  } from 'react-native-paper';
import { Button } from "@react-native-material/core";
  
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import ip from '../ip.json';
import TravelGuide from '../components/TravelGuide';
import SoundPlayer from 'react-native-sound-player';

export default function User({ownerId}) {
  const navigation = useNavigation();
  function handlePress() {
    navigation.navigate('Edit User');
  }

  const [ownerInfo, setOwnerInfo] = useState({
    id: ownerId,
    fullName: "",
    country: "",
  });
  const [userId, setUserId] = useState(null);
  const [followInfo, setFollowInfo] = useState({
    numOfFollowers: 0,
    numOfFollowing: 0
  });

  const [travelGuides, setTravelGuides] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [applications, setApplications] = useState([]);

  const PAGE_TYPE = {
    GUIDES: 'guides',
    ITINERARIES: 'itineraries',
    APPLICATIONS: 'applications'
  };
  const [currentPage, setCurrentPage] = useState(PAGE_TYPE.GUIDES);
  const [contentList, setContentList] = useState([]);
  const [currentPlayingTG, setCurrentPlayingTG] = useState(null);

  useEffect(() => {
    // Authenticate user.
    fetch(`http://${ip.ip}:8000/auth/isLoggedIn`, {
      credentials: 'include',
      method: 'GET',
    })
    .then(res => res.json())
    .then(resBody => {
      if (!resBody.isLoggedIn) {
        navigation.navigate('Home');
      }
      setUserId(resBody.userId);
    })

    // Get User info of the owner (fullname, country)
    fetch(`http://${ip.ip}:8000/user/info?id=${ownerId}`, {
      credentials: 'include',
      method: 'GET'
    })
    .then(res => res.json())
    .then(resBody => {
      if (resBody.statusCode == 200) {
        setOwnerInfo({
          ...ownerInfo,
          fullName: resBody.info.firstName + " " + resBody.info.lastName,
          country: resBody.info.country,
          username: resBody.info.username,
        });
      } else {
        navigation.navigate("MyTabs");
      }
    })

    // Get Follow info of the owner.
    fetch(`http://${ip.ip}:8000/follow/count?userId=${ownerId}`, {
      credentials: 'include',
      method: 'GET'
    })
    .then(res => res.json())
    .then(resBody => {
      if (resBody.statusCode == 200) {
        setFollowInfo({
          numOfFollowers: resBody.numOfFollowers,
          numOfFollowing: resBody.numOfFollowing
        });
      } else {
        navigation.navigate("MyTabs");
      }
    })

    // Get the travel guides created by the owner.
    fetch(`http://${ip.ip}:8000/travelGuide/byCreator?creatorId=${ownerId}`, {
      credentials: 'include',
      method: 'GET'
    })
    .then(res => res.json())
    .then(resBody => {
      if (resBody.statusCode == 200) {
        setTravelGuides(resBody.travelGuides);
        setApplications([...resBody.pendingTravelGuides, ...resBody.rejectedTravelGuides]);
      }
    })

    // Get the itineraries created by the owner.
    fetch(`http://${ip.ip}:8000/itinerary/byCreator?creatorId=${ownerId}`, {
      credentials: 'include',
      method: 'GET'
    })
    .then(res => res.json())
    .then(resBody => {
      if (resBody.statusCode == 200) {
        setItineraries(resBody.itineraries);
      }
    })

  }, [])

  useEffect(() => {
    let candidateList = [...PRIMARY_SECTIONS];
    if (currentPage == PAGE_TYPE.GUIDES) {
      travelGuides.forEach(travelGuide => {
        candidateList.push({
          id: travelGuide._id,
          component: <TravelGuide 
            imageUrl={travelGuide.imageUrl}
            name={travelGuide.name}
            description={travelGuide.description}
            audioUrl={travelGuide.audioUrl}
            audioLength={travelGuide.audioLength}
            currentPlayingTG={currentPlayingTG}
            setCurrentPlayingTG={setCurrentPlayingTG}
            travelGuideId={travelGuide._id}
          />
        });
      });
    } else if (currentPage == PAGE_TYPE.ITINERARIES) {

    } else {
      
    }
    setContentList(candidateList);
  }, [ownerInfo, followInfo, travelGuides, itineraries, currentPage]);

  useEffect(() => {
    console.log("audio playing: " + currentPlayingTG);
  }, [currentPlayingTG]);

  const PRIMARY_SECTIONS = [
    {
      id: 'userInfoSection',
      component: <View style={styles.userInfoSection}>
          <View style={{flex: 2, width: '20%'}}>
            <Avatar.Image
              source={require('../assets/avatar.png')}
              size={85}
            />
          </View>
          <View style={{marginLeft: 20, flex: 7.5}}>
            <Text style={ {
              color: 'black',
              fontSize: 20,
              fontFamily: 'Lexend-Bold',
              marginTop: ownerInfo.country ? 0 : 10,
              marginBottom: ownerInfo.country? 0 : 5
            }}>{ownerInfo.fullName}</Text>
            {ownerInfo.country && <Caption style={styles.caption}>{ownerInfo.country}</Caption>}
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'row', flex: 1}}>
                <Text style={{
                  marginTop: 10,
                  fontSize: 18,
                  lineHeight: 14,
                  fontWeight: '500',
                  color: 'black',
                  fontFamily: 'Lexend-Bold',
                  paddingTop: 8,
                }}>{followInfo.numOfFollowers}</Text>
                <Text style={{
                  marginTop: 10,
                  fontSize: 18,
                  lineHeight: 14,
                  fontWeight: '500',
                  color: 'black',
                  fontFamily: 'Lexend-Regular',
                  paddingTop: 8,
                }}> </Text>
                <Text style={{
                  marginTop: 10,
                  fontSize: 18,
                  lineHeight: 14,
                  fontWeight: '500',
                  color: 'black',
                  fontFamily: 'Lexend-Regular',
                  paddingTop: 8,
                }}>Followers</Text>
              </View>
              <View style={{flexDirection: 'row', flex: 1}}>
                <Text style={{
                    marginTop: 10,
                    fontSize: 18,
                    lineHeight: 14,
                    fontWeight: '500',
                    color: 'black',
                    fontFamily: 'Lexend-Bold',
                    paddingTop: 8,
                  }}>{followInfo.numOfFollowing}</Text>
                  <Text style={{
                    marginTop: 10,
                    fontSize: 18,
                    lineHeight: 14,
                    fontWeight: '500',
                    color: 'black',
                    fontFamily: 'Lexend-Regular',
                    paddingTop: 8,
                  }}> </Text>
                  <Text style={{
                    marginTop: 10,
                    fontSize: 18,
                    lineHeight: 14,
                    fontWeight: '500',
                    color: 'black',
                    fontFamily: 'Lexend-Regular',
                    paddingTop: 8,
                  }}>Following</Text>
              </View>
            </View>
        </View>
      </View>
    },
    {
      id: 'profileButton',
      component: <View style={{width: '100%', backgroundColor: 'white', paddingHorizontal: 30, paddingBottom: 30}}>
        <Button title={userId === ownerId ? "Edit Profile" : "Follow"} variant='contained' color="black" tintColor='white' onPress={() => handlePress()} titleStyle={{
          fontFamily: 'Lexend-Regular'
        }}/>
      </View>
    },
    {
      id: 'contentFilter',
      component: 
      <View>
        <View style={{
          width: '100%', 
          backgroundColor: 'white', 
          flexDirection: 'row', 
          borderColor: 'white', 
          paddingHorizontal: 10,
          paddingBottom: 10}}>
          <View style={{flex: 1}}></View>
          <View style={{
                flex: 4, 
                borderStyle: 'solid', 
                borderStyle: 'solid',
                borderColor: 'white',
                borderBottomColor: 'black',
                borderWidth: 5}}>
            <Text style={{
                marginTop:5 ,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: 13,
                fontFamily: 'Lexend-SemiBold',
                fontSize: 18,
                color: 'black',
              }}>Guides</Text>
          </View>
          <View style={{flex: 1}}></View>
          <View style={{
            flex: 4, 
            borderStyle: 'solid', 
            borderStyle: 'solid',
            borderColor: 'white',
            borderBottomColor: 'white',
            borderWidth: 5
            }}>
            <Text style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop:5 ,
                marginBottom: 13,
                fontFamily: 'Lexend-SemiBold',
                fontSize: 18,
                color: '#878686',
              }}>Itineraries</Text>
          </View>
          <View style={{flex: 1}}></View>
        </View>
          <TouchableOpacity
            activeOpacity={0.75}
          ><View style={{
          backgroundColor: 'black',
          height: 80,
          flexDirection: 'row',
          paddingHorizontal: 15,
          paddingTop: 15,
          marginBottom: 15,
        }}>
          <View style={{
            flex: 1
          }}>
            <Icon name="plus-circle" color="white" size={50}/>
          </View>
          <View style={{
            flex: 5
          }}>
            <Text style={{
                  marginTop: 10,
                  marginRight: 'auto',
                  fontFamily: 'Lexend-SemiBold',
                  fontSize: 18,
                  color: 'white',
                }}>Create Travel Guide</Text>
          </View>
        </View></TouchableOpacity>
      </View>
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfoHeader}>
          <View style={{flex: 10}}>
            <Text style={{
              marginTop:5 ,
              marginBottom: 13,
              fontFamily: 'Lexend-Bold',
              fontSize: 22,
              color: 'black',
            }}>{ownerInfo.username}</Text>
          </View>
      </View>
      <FlatList
        data={contentList}
        renderItem={({item}) => item.component}
        keyExtractor={item => item.id}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode='never'
        showsVerticalScrollIndicator={false}
        // stickyHeaderIndices={[2]}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      flex: 1
    },
    userInfoHeader: {
      paddingHorizontal: 20,
      backgroundColor: 'white',
      flexDirection: 'row',
      paddingTop: 10,
      paddingBottom: 15,
    },
    userInfoSection: {
      paddingLeft: 15,
      paddingRight: 5,
      backgroundColor: 'white',
      shadowColor: 'black',
      shadowOffset: {
        width: 10,
        height: 10,
      },
      shadowOpacity: 0.5,
      shadowRadius: 3,
      flexDirection: 'row',
      paddingBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      borderStyle: 'solid',
      borderColor: 'black',
      fontFamily: 'Lexend-ExtraLight',
    },
    caption: {
      paddingTop: 10,
      fontSize: 15,
      lineHeight: 14,
      fontWeight: '500',
      color: 'black',
      fontFamily: 'Lexend-Regular',
    },
    row: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    infoBoxWrapper: {
      borderBottomColor: '#dddddd',
      borderBottomWidth: 1,
      borderTopColor: '#dddddd',
      borderTopWidth: 1,
      flexDirection: 'row',
      height: 100,
    },
    infoBox: {
      width: '50%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuWrapper: {
      marginTop: 10,
    },
    menuItem: {
      flexDirection: 'row',
      paddingVertical: 15,
      paddingHorizontal: 30,
    },
    menuItemText: {
      color: '#777777',
      marginLeft: 20,
      fontWeight: '600',
      fontSize: 16,
      lineHeight: 26,
    },
    icon: {
      height: 40,
      width: 40,
    }
  });