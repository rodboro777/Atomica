import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator, Text, TouchableOpacity} from 'react-native';

export default function ContentsWithinAreaHeader({
  currentPage,
  locationsWithinFrame,
  windowHeight,
  windowWidth,
  handleExitContentsForLocation,
}) {
  const [isLoading, setLoading] = useState(true);
  const PAGE_TYPE = {
    GUIDES: 'guides',
    ITINERARIES: 'itineraries',
    DETAILED_ITI: 'detailedIti',
  };

  const [title, setTitle] = useState('');

  useEffect(() => {
    setLoading(true);

    // based on the current page, count the number of contents.
    let memo = new Set();
    let total = 0;
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
            total += 1;
          }
        }
      }
    });

    if (currentPage == PAGE_TYPE.GUIDES) {
      setTitle(`${total} travel guides in this area`);
    } else {
      setTitle(`${total} itineraries in this area`);
    }

    setLoading(false);
  }, [locationsWithinFrame, currentPage]);

  return (
    <>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="black"
          style={{
            marginTop: 15,
          }}
        />
      ) : (
        <Text
          style={{
            fontFamily: 'Lexend-SemiBold',
            fontSize: 16,
            color: 'black',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 15,
            textAlign: 'center',
          }}>
          {title}
        </Text>
      )}
      {/* <TouchableOpacity
                onPress={handleExitContentsForLocation}
                activeOpacity={0.7}
                style={{
                    position: 'absolute',
                    left: (windowWidth / 2) - 55,
                    top: (windowHeight / 2) + 100,
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
            </TouchableOpacity> */}
    </>
  );
}
