import {
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Button} from '@react-native-material/core';
import axios from 'axios';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ip from '../ip.json';
import TravelGuide from '../components/TravelGuide';
import Itinerary from '../components/Itinerary';
import Application from '../components/Application';
import UserInfoSection from '../components/UserInfoSection';
import ContentFilter from '../components/ContentFilter';
import SoundPlayer from 'react-native-sound-player';
import {useIsFocused} from '@react-navigation/native';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';

export default function User({ownerId, navigation, origin, route}) {
  const isFocused = useIsFocused();
  bs = React.createRef();
  fall = new Animated.Value(1);

  renderInner = () => (
    <View style={styles.panel}>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.panelTitle}>Create Content</Text>
      </View>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => {
          navigation.navigate('Create TravelGuide');
        }}>
        <Text style={styles.panelButtonTitle}>Create Travel Guide</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => {
          navigation.navigate('Create Itinerary', {item: {}, isEdit: false});
        }}>
        <Text style={styles.panelButtonTitle}>Create Itinerary</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => this.bs.current.snapTo(1)}>
        <Text style={styles.panelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    console.log('FINISH CREATING TRAVEL GUIDEEE');
    console.log(route);
    this.bs.current.snapTo(1);
    if (route && route.params && route.params.origin == 'CreateTravelGuide') {
      setCurrentPage(PAGE_TYPE.APPLICATIONS);
    } else if (route && route.params && route.params.origin == 'CreateItinerary') {
      setCurrentPage(PAGE_TYPE.ITINERARIES);
    }
  }, [isFocused]);

  const [ownerInfo, setOwnerInfo] = useState({
    id: ownerId,
    fullName: '',
    country: '',
  });
  const [userId, setUserId] = useState(null);
  const [followInfo, setFollowInfo] = useState({
    numOfFollowers: 0,
    numOfFollowing: 0,
  });

  const [travelGuides, setTravelGuides] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [applications, setApplications] = useState([]);

  // Only use this when ownerId != userId
  const [isFollowing, setFollowing] = useState(false);

  const PAGE_TYPE = {
    GUIDES: 'guides',
    ITINERARIES: 'itineraries',
    APPLICATIONS: 'applications',
  };
  const [currentPage, setCurrentPage] = useState(PAGE_TYPE.GUIDES);
  const [contentList, setContentList] = useState([]);
  const [currentPlayingTG, setCurrentPlayingTG] = useState(null);

  const fetchFollowInfo = () => {
    // Get Follow info of the owner.
    fetch(`http://${ip.ip}:8000/follow/count?userId=${ownerId}`, {
      credentials: 'include',
      method: 'GET',
    })
      .then(res => res.json())
      .then(resBody => {
        if (resBody.statusCode == 200) {
          setFollowInfo({
            numOfFollowers: resBody.numOfFollowers,
            numOfFollowing: resBody.numOfFollowing,
          });
        } else {
          navigation.navigate('MyTabs');
        }
      });
  }

  const preparePageData = () => {
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
      });

    // Get User info of the owner (fullname, country)
    fetch(`http://${ip.ip}:8000/user/info?id=${ownerId}`, {
      credentials: 'include',
      method: 'GET',
    })
      .then(res => res.json())
      .then(resBody => {
        if (resBody.statusCode == 200) {
          setOwnerInfo({
            ...ownerInfo,
            fullName: resBody.info.firstName + ' ' + resBody.info.lastName,
            country: resBody.info.country,
            username: resBody.info.username,
            imageUrl: resBody.info.imageUrl,
          });
        } else {
          navigation.navigate('MyTabs');
        }
      });

    // Get the travel guides created by the owner.
    fetch(`http://${ip.ip}:8000/travelGuide/byCreator?creatorId=${ownerId}`, {
      credentials: 'include',
      method: 'GET',
    })
      .then(res => res.json())
      .then(resBody => {
        if (resBody.statusCode == 200) {
          setTravelGuides(resBody.travelGuides);
          setApplications([
            ...resBody.pendingTravelGuides,
            ...resBody.rejectedTravelGuides,
          ]);
        }
      });

    // Get the itineraries created by the owner.
    fetch(`http://${ip.ip}:8000/itinerary/byCreator?creatorId=${ownerId}`, {
      credentials: 'include',
      method: 'GET',
    })
      .then(res => res.json())
      .then(resBody => {
        if (resBody.statusCode == 200) {
          setItineraries(resBody.itineraries);
        }
      });
  }

  useEffect(() => {
    fetchFollowInfo();
  }, [isFollowing]);

  useEffect(() => {
    preparePageData();
  }, [isFocused]);

  useFocusEffect(
    React.useCallback(() => {
      preparePageData();
      fetchFollowInfo();
    }, [])
  );

  useEffect(() => {
    if (userId && userId != ownerId) {
      fetch(
        `http://${ip.ip}:8000/follow/isFollowing?followerId=${userId}&followedId=${ownerId}`,
        {
          credentials: 'include',
          method: 'GET',
        },
      )
        .then(res => res.json())
        .then(resBody => {
          if (resBody.statusCode == 200) {
            setFollowing(resBody.isFollowing);
          }
        });
    }
  }, [userId]);

  useEffect(() => {
    let candidateList = [...PRIMARY_SECTIONS];
    if (currentPage == PAGE_TYPE.GUIDES) {
      travelGuides.forEach(travelGuide => {
        candidateList.push({
          id: travelGuide._id,
          type: 'travelGuide',
          travelGuide: travelGuide,
        });
      });
    } else if (currentPage == PAGE_TYPE.ITINERARIES) {
      itineraries.forEach(itinerary => {
        candidateList.push({
          id: itinerary._id,
          type: 'itinerary',
          itinerary: itinerary,
        });
      });
    } else {
      applications.forEach(application => {
        candidateList.push({
          id: application._id,
          type: 'application',
          application: application,
        });
      });
    }
    setContentList(candidateList);
  }, [
    ownerInfo,
    followInfo,
    travelGuides,
    applications,
    itineraries,
    currentPage,
  ]);

  useEffect(() => {
    setCurrentPlayingTG(null);
  }, [currentPage]);

  useEffect(() => {
    SoundPlayer.addEventListener('FinishedPlaying', () => {
      setCurrentPlayingTG(null);
    });
  }, []);

  function renderItem({item}) {
    if (item.type == 'userInfoSection') {
      return <UserInfoSection ownerInfo={ownerInfo} followInfo={followInfo} />;
    } else if (item.type == 'profileButton') {
      return (
        <View
          style={{
            width: '100%',
            backgroundColor: 'white',
            paddingHorizontal: 30,
            paddingBottom: 30,
          }}>
          <Button
            title={
              userId === ownerId
                ? 'Edit Profile'
                : isFollowing
                ? 'Unfollow'
                : 'Follow'
            }
            variant="contained"
            color="black"
            tintColor="white"
            onPress={() => handlePress()}
            titleStyle={{
              fontFamily: 'Lexend-Regular',
            }}
          />
        </View>
      );
    } else if (item.type == 'contentFilter') {
      return (
        <ContentFilter
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isOwner={userId === ownerId}
        />
      );
    } else if (item.type == 'travelGuide') {
      return (
        <TravelGuide
          travelGuide={item.travelGuide}
          currentPlayingTG={currentPlayingTG}
          setCurrentPlayingTG={setCurrentPlayingTG}
          isUserProfilePage={true}
        />
      );
    } else if (item.type == 'itinerary') {
      return (
        <Itinerary
          item={item.itinerary}
          navigation={navigation}
          isUserProfilePage={true}
          isDetail={false}
        />
      );
    } else if (item.type == 'application') {
      return (
        <Application
          imageUrl={item.application.imageUrl}
          name={item.application.name}
          description={item.application.description}
          audioUrl={item.application.audioUrl}
          audioLength={item.application.audioLength}
          currentPlayingTG={currentPlayingTG}
          setCurrentPlayingTG={setCurrentPlayingTG}
          applicationId={item.application._id}
          status={item.application.status}
          reviewerComment={item.application.reviewerComment}
          locationName={item.application.locationName}
          creatorId={item.application.creatorId}
        />
      );
    }
  }

  const PRIMARY_SECTIONS = [
    {
      id: 'userInfoSection',
      type: 'userInfoSection',
    },
    {
      id: 'profileButton',
      type: 'profileButton',
    },
    {
      id: 'contentFilter',
      type: 'contentFilter',
    },
  ];

  async function handlePress() {
    if (ownerId == userId) {
      navigation.navigate('Edit User', {ownerInfo: ownerInfo});
    } else {
      let reqBody = {
        followerId: userId,
        followedId: ownerId,
      };
      if (isFollowing) {
        axios
          .post(`http://${ip.ip}:8000/follow/unfollow`, reqBody)
          .then(res => res.data)
          .then(resBody => {
            if (resBody.statusCode == 200) {
              setFollowing(false);
            } else {
              Alert.alert('Failed to do unfollow operation');
            }
          });
      } else {
        axios
          .post(`http://${ip.ip}:8000/follow/follow`, reqBody)
          .then(res => res.data)
          .then(resBody => {
            if (resBody.statusCode == 200) {
              setFollowing(true);
            } else {
              Alert.alert('Failed to do follow operation');
            }
          });
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {contentList.length >= 3 && (
        <>
          <View style={styles.userInfoHeader}>
            {origin == 'Home' && (
              <TouchableOpacity
                style={{
                  flex: 1.5,
                }}
                onPress={() => {
                    navigation.navigate('Map');
                }}>
                <Icon
                  name="keyboard-backspace"
                  color="black"
                  size={30}
                  style={{
                    marginTop: 'auto',
                    marginBottom: 'auto',
                  }}
                />
              </TouchableOpacity>
            )}
            <View style={{flex: 10}}>
              <Text
                style={{
                  marginTop: 5,
                  marginBottom: 13,
                  fontFamily: 'Lexend-Bold',
                  fontSize: 22,
                  color: 'black',
                }}>
                {ownerInfo.username}
              </Text>
            </View>
            {origin == 'Tab' && (
              <TouchableOpacity onPress={() => this.bs.current.snapTo(0)}>
                <Icon
                  name="plus-box-outline"
                  color="black"
                  size={30}
                  style={{
                    marginTop: 'auto',
                    marginBottom: 'auto',
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={contentList}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            bounces={false}
            alwaysBounceVertical={false}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            stickyHeaderIndices={[2]}
          />
        </>
      )}
      <BottomSheet
        ref={this.bs}
        snapPoints={[260, 0]}
        renderContent={this.renderInner}
        initialSnap={1}
        callbackNode={this.fall}
        enabledGestureInteraction={true}
      />
      <Animated.View
        style={{
          margin: 0,
          opacity: Animated.add(0.1, Animated.multiply(this.fall, 1.0)),
        }}></Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
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
  },
  panel: {
    padding: 20,
    backgroundColor: '#f0f2f5',
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
    fontFamily: 'Lexend-Bold',
    color: 'black',
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'black',
    height: 30,
    marginBottom: 10,
    fontFamily: 'Lexend-Regular',
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: 'black',
    alignItems: 'center',
    marginVertical: 7,
    fontFamily: 'Lexend-Regular',
  },
  panelButtonTitle: {
    fontSize: 17,
    fontFamily: 'Lexend-Regular',
    color: 'white',
  },
});
