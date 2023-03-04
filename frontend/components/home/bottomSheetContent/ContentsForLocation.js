import React, { useEffect, useState } from 'react';
import SoundPlayer from 'react-native-sound-player';
import {FlatList, TouchableOpacity, Text, View, StyleSheet} from 'react-native';
import TravelGuide from '../../TravelGuide';
import Itinerary from '../../Itinerary';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ip from '../../../ip';

export default function ContentsForLocationContent({
    locationsWithinFrame,
    locationPlaceId,
    currentPage,
    navigation,
    handleUpOverScrollModal,
    windowWidth,
    windowHeight,
    userId
}) {
    const PAGE_TYPE = {
        GUIDES: 'guides',
        ITINERARIES: 'itineraries'
    };

    const [flatListContents, setFlatListContents] = useState([]);

    const [currentPlayingTG, setCurrentPlayingTG] = useState(null);

    const handleCloseModalByOverScrolling = () => {
        setCurrentPlayingTG(null);
        handleUpOverScrollModal();
    }

    // We don't need to fetch location contents (travel guides nor itineraries)
    // in this useEffect since the NewMap screen is already doing the job as soon
    // as the region changes. We just need to wait until the locationsWithinFrame
    // state is updated by the NewMap component.
    useEffect(() => {
        let flatListContentsCandidate = [];
        if (locationPlaceId in locationsWithinFrame) {
            if (currentPage == PAGE_TYPE.GUIDES && locationsWithinFrame[locationPlaceId].travelGuides) {
                flatListContentsCandidate = locationsWithinFrame[locationPlaceId].travelGuides.map(travelGuide => {
                    return {
                        ...travelGuide,
                        type: PAGE_TYPE.GUIDES
                    }
                });
            } else if (currentPage == PAGE_TYPE.ITINERARIES && locationsWithinFrame[locationPlaceId].itineraries) {
                flatListContentsCandidate = locationsWithinFrame[locationPlaceId].itineraries.map(itinerary => {
                    return {
                        ...itinerary,
                        type: PAGE_TYPE.ITINERARIES
                    }
                });
            }
        }

        fetch(`http://${ip.ip}:8000/follow/followedUsers`, {
          credentials: 'include',
          method: 'GET'
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
          flatListContentsCandidate.sort((a, b) => {
            // Self-made.
            if (a.creatorId == userId && b.creatorId != userId) {
              return -1;
            }
            if (b.creatorId == userId && a.creatorId != userId) {
              return 1;
            }

            // followed users.
            if (followedUsers.has(a.creatorId) && !(followedUsers.has(b.creatorId))) {
              return -1;
            }
            if (followedUsers.has(b.creatorId) && !(followedUsers.has(a.creatorId))) {
              return 1;
            }

            // sort by rating.
            if (currentPage == PAGE_TYPE.ITINERARIES) {
              return b.rating - a.rating;
            }

            return 0;
          });
  
          setFlatListContents(flatListContentsCandidate);
        })

    }, [locationsWithinFrame, currentPage, locationPlaceId]);

    useEffect(() => {
        SoundPlayer.addEventListener('FinishedPlaying', () => {
          setCurrentPlayingTG(null);
        });
    }, []);

    // For FlatList.
    const renderItem = (item) => {
        item = item.item;

        if (item.type && item.type != currentPage) {
            return;
        }

        if (currentPage == PAGE_TYPE.GUIDES) {
          return(
            <TravelGuide 
              imageUrl={item.imageUrl}
              name={item.name}
              description={item.description}
              audioUrl={item.audioUrl}
              audioLength={item.audioLength}
              currentPlayingTG={currentPlayingTG}
              setCurrentPlayingTG={setCurrentPlayingTG}
              travelGuideId={item._id}
              locationName={item.locationName}
              creatorId={item.creatorId}
              navigation={navigation}
            />
          )
        } else {
          return (
            <Itinerary 
              itineraryId={item._id}
              imageUrl={item.imageUrl}
              name={item.name}
              description={item.description}
              rating={item.rating}
              navigation={navigation}
              creatorId={item.creatorId}
            />
          )
        }
    };

    return (
        <>
            <View style={{
                width: '90%',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 5
            }}>
                <TouchableOpacity
                    onPress={handleCloseModalByOverScrolling}
                    activeOpacity={0.7}
                    style={{
                        width: 70,
                        height: 30,
                        backgroundColor: 'black',
                        borderRadius: 50,
                    }}
                >
                    <View style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: 'auto',
                        marginBottom: 'auto',
                        flexDirection: 'row'
                    }}>
                        <Icon 
                            name="map"
                            style={{
                                color: 'white',
                                marginTop: 'auto',
                                marginBottom: 'auto'
                            }}
                            size={20}
                        />
                        <Text style={{
                            color: 'white',
                            fontFamily: 'Lexend-SemiBold',
                            fontSize: 15,
                            marginTop: 'auto',
                            marginBottom: 'auto',
                            marginLeft: 5
                        }}>
                            Map
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.stripIcon}/>
            <FlatList 
                onScroll={(event) => {
                    let currentOffset = event.nativeEvent.contentOffset.y;
                    if (currentOffset == 0) {
                        handleCloseModalByOverScrolling();
                    }
                }}
                bounces={false}
                showsVerticalScrollIndicator={false}
                data={flatListContents}
                keyExtractor={item => item._id}
                renderItem={renderItem}
            />
        </>
    )
}

const styles = StyleSheet.create({
    stripIcon: {
        width: '100%',
        backgroundColor: 'grey',
        height: 1,
        borderRadius: 50,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10
    }
});