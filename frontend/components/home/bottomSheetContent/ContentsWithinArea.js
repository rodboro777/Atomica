import React, {useEffect, useState} from 'react';
import {FlatList, TouchableOpacity, Text, View} from 'react-native';
import TravelGuide from '../../TravelGuide';
import Itinerary from '../../Itinerary';
import SoundPlayer from 'react-native-sound-player';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ContentsWithinAreaContent({
    currentPage,
    navigation,
    locationsWithinFrame,
    handleUpOverScrollModal,
    windowWidth,
    windowHeight
}) {
    const PAGE_TYPE = {
        GUIDES: 'guides',
        ITINERARIES: 'itineraries'
    };

    const FILLER = 'filler';

    const [flatListContents, setFlatListContents] = useState([]);

    const [currentPlayingTG, setCurrentPlayingTG] = useState(null);

    const handleCloseModalByOverScrolling = () => {
        setCurrentPlayingTG(null);
        handleUpOverScrollModal();
    }

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
              if (!(content._id in memo)) {
                memo.add(content._id);
                uniqueContents.push({
                  ...content,
                  type: currentPage
                });
              }
            }
          }
        });

        if (uniqueContents.length > 1) {
          uniqueContents.push({
            _id: FILLER,
            type: FILLER
          });
        }

        setFlatListContents(uniqueContents);
    }, [locationsWithinFrame, currentPage]);

    useEffect(() => {
        SoundPlayer.addEventListener('FinishedPlaying', () => {
          setCurrentPlayingTG(null);
        });
    }, []);

    // For FlatList.
    const renderItem = (item) => {
        item = item.item;
        if (item.type && item.type == FILLER) {
          return (
            <View 
              style={{
                height: 100
              }}
            />
          )
        }

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
            <FlatList 
                onScroll={(event) => {
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
                    left: (windowWidth / 2) - 55,
                    bottom: 30,
                    width: 110,
                    height: 60,
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
                        size={30}
                    />
                    <Text style={{
                        color: 'white',
                        fontFamily: 'Lexend-SemiBold',
                        fontSize: 17,
                        marginTop: 'auto',
                        marginBottom: 'auto',
                        marginLeft: 5
                    }}>
                        Map
                    </Text>
                </View>
            </TouchableOpacity>
        </>
    )
}