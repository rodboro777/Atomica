import React, {useEffect, useState} from 'react';
import {FlatList, TouchableOpacity, Text, View} from 'react-native';
import TravelGuide from '../../TravelGuide';
import Itinerary from '../../Itinerary';
import SoundPlayer from 'react-native-sound-player';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ip from '../../../ip';
import SkeletonLoader from '../../SkeletonLoader';

export default function ContentsWithinAreaContent({
  currentPage,
  navigation,
  locationsWithinFrame,
  handleUpOverScrollModal,
  windowWidth,
  windowHeight,
  userId,
  setCurrentBottomSheetType,
  setSelectedItinerary,
  currentBottomSheetType,
  setPrevType,
  setShowDetailIti,
  setShowDirection,
  sheetRef,
  setIsLoading,
  isLoading,
  activateTravelGuideNav
}) {
  const PAGE_TYPE = {
    GUIDES: 'guides',
    ITINERARIES: 'itineraries',
  };

  const FILLER = 'filler';

  const [flatListContents, setFlatListContents] = useState([]);

  const [currentPlayingTG, setCurrentPlayingTG] = useState(null);

  const handleCloseModalByOverScrolling = () => {
    setCurrentPlayingTG(null);
    handleUpOverScrollModal();
  };

  useEffect(() => {
    let memo = new Set();
    let uniqueContents = [];
    Object.keys(locationsWithinFrame).forEach(placeId => {
      let contents = [];
      if (currentPage == PAGE_TYPE.GUIDES) {
        contents = locationsWithinFrame[placeId].travelGuides;
      } else {
        contents = locationsWithinFrame[placeId].itineraries;
      }

      if (contents) {
        for (let i = 0; i < contents.length; i++) {
          let content = contents[i];
          if (!(memo.has(content._id))) {
            memo.add(content._id);
            uniqueContents.push({
              ...content,
              type: currentPage,
            });
          }
        }
      }
    });

    fetch(`http://${ip.ip}:8000/follow/followedUsers`, {
      credentials: 'include',
      method: 'GET',
    })
      .then(res => res.json())
      .then(resBody => {
        let followedUsers = new Set();
        if (resBody.statusCode == 200) {
          resBody.followedUsers.forEach(info => {
            followedUsers.add(info.followedId);
          });
        }

        // This is the infamous Guidify's ranking algorithm :)
        // Ranking factor (ordered from most prioritized to least): self-made, followed user, rating, others.
        uniqueContents.sort((a, b) => {
          // Self-made.
          if (a.creatorId == userId && b.creatorId != userId) {
            return -1;
          }
          if (b.creatorId == userId && a.creatorId != userId) {
            return 1;
          }

          // followed users.
          if (
            followedUsers.has(a.creatorId) &&
            !followedUsers.has(b.creatorId)
          ) {
            return -1;
          }
          if (
            followedUsers.has(b.creatorId) &&
            !followedUsers.has(a.creatorId)
          ) {
            return 1;
          }

          // sort by rating.
          if (currentPage == PAGE_TYPE.ITINERARIES) {
            return b.rating - a.rating;
          }

          return 0;
        });

        if (uniqueContents.length > 1) {
          uniqueContents.push({
            _id: FILLER,
            type: FILLER,
          });
        }
        setFlatListContents(uniqueContents);
        setIsLoading(false);
      });
  }, [locationsWithinFrame, currentPage]);

  useEffect(() => {
    SoundPlayer.addEventListener('FinishedPlaying', () => {
      setCurrentPlayingTG(null);
    });
  }, []);

  // For FlatList.
  const renderItem = item => {
    item = item.item;
    if (item.type && item.type == FILLER) {
      return (
        <View style={{height: isLoading ? 'auto' : 100}}>
          {isLoading && <SkeletonLoader />}
        </View>
      );
    }
    if (item.type && item.type != currentPage) {
      return;
    }

    if (currentPage == PAGE_TYPE.GUIDES) {
      return (
        <TravelGuide
          currentPlayingTG={currentPlayingTG}
          setCurrentPlayingTG={setCurrentPlayingTG}
          navigation={navigation}
          travelGuide={item}
          closeCurrentModal={handleUpOverScrollModal}
          activateTravelGuideNav={activateTravelGuideNav}
        />
      );
    } else {
      return (
        <Itinerary
          navigation={navigation}
          item={item}
          setCurrentBottomSheetType={setCurrentBottomSheetType}
          setSelectedItinerary={setSelectedItinerary}
          setPrevType={setPrevType}
          currentBottomSheetType={currentBottomSheetType}
          setShowDetailIti={setShowDetailIti}
          setShowDirection={setShowDirection}
          sheetRef={sheetRef}
          isDetail={false}
        />
      );
    }
  };

  return (
    <>
      <FlatList
        onScroll={event => {
          let currentOffset = event.nativeEvent.contentOffset.y;
          if (currentOffset == 0) {
            handleCloseModalByOverScrolling();
          }
        }}
        style={{
          marginTop: 20,
        }}
        bounces={false}
        showsVerticalScrollIndicator={false}
        data={flatListContents}
        keyExtractor={item => item._id}
        renderItem={renderItem}
      />
      <TouchableOpacity
        onPress={handleCloseModalByOverScrolling}
        activeOpacity={0.7}
        style={{
          position: 'absolute',
          left: windowWidth / 2 - 55,
          bottom: 30,
          width: 110,
          height: 60,
          backgroundColor: 'black',
          borderRadius: 50,
        }}>
        <View
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 'auto',
            marginBottom: 'auto',
            flexDirection: 'row',
          }}>
          <Icon
            name="map"
            style={{
              color: 'white',
              marginTop: 'auto',
              marginBottom: 'auto',
            }}
            size={30}
          />
          <Text
            style={{
              color: 'white',
              fontFamily: 'Lexend-SemiBold',
              fontSize: 17,
              marginTop: 'auto',
              marginBottom: 'auto',
              marginLeft: 5,
            }}>
            Map
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );
}
