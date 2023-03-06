import React, {useEffect, useState} from 'react';
import {Image, View, Text, StyleSheet} from 'react-native';

export default function ContentsForLocationHeader({
  sheetRef,
  locationName,
  locationImageUrl,
  locationsWithinFrame,
  locationPlaceId,
  currentPage,
}) {
  const PAGE_TYPE = {
    GUIDES: 'guides',
    ITINERARIES: 'itineraries',
    DETAILED_ITI: 'detailedIti',
  };

  useEffect(() => {
    sheetRef.current.snapTo(1);
  }, []);

  const [numOfContents, setNumOfContents] = useState(0);

  useEffect(() => {
    if (locationPlaceId in locationsWithinFrame) {
      if (currentPage == PAGE_TYPE.GUIDES) {
        if (
          locationsWithinFrame[locationPlaceId].travelGuides &&
          locationsWithinFrame[locationPlaceId].travelGuides.length > 0
        ) {
          setNumOfContents(
            locationsWithinFrame[locationPlaceId].travelGuides.length,
          );
        } else {
          setNumOfContents(0);
        }
      } else {
        if (
          locationsWithinFrame[locationPlaceId].itineraries &&
          locationsWithinFrame[locationPlaceId].itineraries.length > 0
        ) {
          setNumOfContents(
            locationsWithinFrame[locationPlaceId].itineraries.length,
          );
          console.log(locationsWithinFrame[locationPlaceId].itineraries.length);
        } else {
          setNumOfContents(0);
        }
      }
    } else {
      setNumOfContents(0);
    }
  }, [locationsWithinFrame, currentPage]);

  return (
    <View
      style={{
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
      {numOfContents == 0 && (
        <Image
          source={{uri: locationImageUrl}}
          style={{
            width: '100%',
            height: 200,
            resizeMode: 'cover',
            borderRadius: 10,
            marginTop: 20,
          }}
        />
      )}
      <Text
        style={{
          fontFamily: 'Lexend-SemiBold',
          fontSize: 18,
          color: 'black',
          marginTop: 5,
        }}>
        {locationName}
      </Text>
    </View>
  );
}
