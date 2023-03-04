import React, { useEffect, useState } from 'react';
import SoundPlayer from 'react-native-sound-player';
import {FlatList, TouchableOpacity, Text, View, StyleSheet} from 'react-native';
import TravelGuide from '../../TravelGuide';
import Itinerary from '../../Itinerary';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ContentsForLocationContent({
    locationsWithinFrame,
    locationPlaceId,
    currentPage,
    navigation,
    handleUpOverScrollModal,
    windowWidth,
    windowHeight
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
        if (locationPlaceId in locationsWithinFrame) {
            if (currentPage == PAGE_TYPE.GUIDES && locationsWithinFrame[locationPlaceId].travelGuides) {
                setFlatListContents(locationsWithinFrame[locationPlaceId].travelGuides.map(travelGuide => {
                    return {
                        ...travelGuide,
                        type: PAGE_TYPE.GUIDES
                    }
                }));
            } else if (currentPage == PAGE_TYPE.ITINERARIES && locationsWithinFrame[locationPlaceId].itineraries) {
                setFlatListContents(locationsWithinFrame[locationPlaceId].itineraries.map(itinerary => {
                    return {
                        ...itinerary,
                        type: PAGE_TYPE.ITINERARIES
                    }
                }));
            }
        } else {
            setFlatListContents([]);
        }
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