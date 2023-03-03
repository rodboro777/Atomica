import React, {useState, useEffect} from 'react';
import {StyleSheet, FlatList, SafeAreaView, View, Text, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, {Marker} from 'react-native-maps';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import Geolocation from '@react-native-community/geolocation';
import {Dimensions} from 'react-native';
import ip from '../ip';
import ContentsWithinAreaContent from '../components/home/bottomSheetContent/ContentsWithinArea';
import ContentsWithinAreaHeader from '../components/home/bottomSheetHeader/ContentsWithinArea';

export default function NewMap({navigation}) {
    const [region, setRegion] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);

    const [locationsWithinFrame, setLocationsWithinFrame] = useState([]);
    const mapKey = 'AIzaSyCsdtGfQpfZc7tbypPioacMv2y7eMoaW6g';

    function handleRegionChange(val) {
        setRegion(val);
    }

    const BOTTOM_SHEET_TYPE = {
        CONTENTS_WITHIN_AREA: 'contentsWithinArea',
        CONTENTS_FOR_LOCATION: 'contentsForLocation'
    };
    const [currentBottomSheetType, setCurrentBottomSheetType] = useState(BOTTOM_SHEET_TYPE.CONTENTS_WITHIN_AREA);

    const PAGE_TYPE = {
        GUIDES: 'guides',
        ITINERARIES: 'itineraries'
    };
    const [currentPage, setCurrentPage] = useState(PAGE_TYPE.GUIDES);

    const sheetRef = React.useRef(null);
    const mapRef = React.useRef(null);
    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;

    const renderBottomSheetBackdrop = () => (
        <Animated.View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
    );

    const getContentBasedOnBottomSheetType = () => {
      if (currentBottomSheetType == BOTTOM_SHEET_TYPE.CONTENTS_WITHIN_AREA) {
        return <ContentsWithinAreaContent 
          currentPage={currentPage}
          locationsWithinFrame={locationsWithinFrame}
          navigation={navigation}
          handleUpOverScrollModal={handleUpOverScrollModal}
          windowWidth={windowWidth}
          windowHeight={windowHeight}
        />
      }
    };

    const getHeaderBasedOnBottomSheetType = () => {
      if (currentBottomSheetType == BOTTOM_SHEET_TYPE.CONTENTS_WITHIN_AREA) {
        return <ContentsWithinAreaHeader 
          currentPage={currentPage}
          locationsWithinFrame={locationsWithinFrame}
        />
      }
    }

    // For BottomSheet.
    const renderBottomSheetContent = () => (
        <View
          style={{
            backgroundColor: 'white',
            paddingBottom: 10,
            height: windowHeight - 190,
            zIndex: 1
          }}
        >
          {getContentBasedOnBottomSheetType()}
        </View>
    );

    const renderBottomSheetHeader = () => (
      <View
          style={{
            backgroundColor: 'white',
            paddingTop: 10,
            zIndex: 1,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
        >
          <View style={styles.stripIcon} />
          {getHeaderBasedOnBottomSheetType()}
        </View>
    );

    // Modal is being overscrolled upwards, hence, close the modal.
    const handleUpOverScrollModal = () => {
      sheetRef.current.snapTo(1);
    };

    useEffect(() => {
      // get user position and set region to focus on user's position.
      Geolocation.getCurrentPosition(
        pos => {
          setRegion({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          });
        },
        err => Alert.alert("Unable to get user's current position"),
        {
          enableHighAccuracy: true
        }
      );
    }, []);

    const getPlacesWithinFrame = async() => {
        const {northEast, southWest} = await mapRef.current.getMapBoundaries();

        // calculate radius.
        let radius = 0;
        if (northEast.latitude == 0 && northEast.longitude == 0 && southWest.latitude == 0 && southWest.longitude == 0) {
          // TODO: this is bad. need to find out how to get correct radius when getMapBoundaries is not 
          // activated yet (i.e., returns 0 for everything). the current value is dependant on the initialRegion
          // having latitudeDelta and longitudeDelta both equal to 0.01.
          radius = 558.812037159875;
        } else {
          const latDiff = Math.abs(northEast.latitude - southWest.latitude);
          const lngDiff = Math.abs(northEast.longitude - southWest.longitude);
          radius = (Math.max(latDiff, lngDiff) * 69 * 1.60934 * 1000) / 2;
        }
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${region.latitude},${region.longitude}&type=point_of_interest&radius=${radius}&key=${mapKey}`
        );
        const locations = await response.json();
        return locations;
    };

    useEffect(() => {
        if (region) {
          getPlacesWithinFrame()
            .then(async (data) => {
                const locations = data.results;
                let locationsWithinFrameCandidate = {};
                let queryParams = "";
                locations.forEach((location, index) => {
                  locationsWithinFrameCandidate[location.place_id] = {
                    latitude: location.geometry.location.lat,
                    longitude: location.geometry.location.lng,
                    name: location.name
                  };
                  queryParams += `placeIds=${location.place_id}`;
                  if (index < locations.length - 1) {
                    queryParams += '&';
                  }
                });
                
                let locationsDataRes = await fetch(`http://${ip.ip}:8000/travelGuide/byLocations?${queryParams}`, {
                  credentials: 'include',
                  method: 'GET'
                });
                locationsDataRes = await locationsDataRes.json();

                if (locationsDataRes.statusCode != 200) {
                  Alert.alert("Failed to retrieve locationsData");
                }

                const locationsData = locationsDataRes.data;
                Object.keys(locationsData).forEach(placeId => {
                    locationsWithinFrameCandidate[placeId].travelGuides = locationsData[placeId].travelGuides;
                    locationsWithinFrameCandidate[placeId].itineraries = locationsData[placeId].itineraries;
                });

                setLocationsWithinFrame(locationsWithinFrameCandidate);
            })
        }
    }, [region]);

    return (
        <SafeAreaView style={styles.container}>
            {region && <><View style={styles.topView}>
                <TouchableOpacity 
                    style={styles.searchBarContainer}
                    activeOpacity={0.8}
                >
                    <Icon
                        name="magnify"
                        color="grey"
                        size={30}
                        style={{
                            marginTop: 'auto',
                            marginBottom: 'auto',
                        }}
                    />
                    <Text style={{
                            marginTop: 'auto',
                            marginBottom: 'auto',
                            marginLeft: 10,
                            fontSize: 17,
                            fontFamily: 'Lexend-Regular',
                            color: 'grey'
                        }}>
                        Search for locations...
                    </Text>
                </TouchableOpacity>
                <View style={styles.tabsContainer}>
                    <View></View>
                    <TouchableOpacity 
                        style={{
                            flex: 4, 
                            borderStyle: 'solid',
                            borderColor: 'white',
                            borderBottomColor: currentPage == PAGE_TYPE.GUIDES ? 'black' : 'white',
                            borderWidth: 2,
                        }}
                        onPress={() => setCurrentPage(PAGE_TYPE.GUIDES)}
                        activeOpacity={0.6}
                    >
                        <Text style={{
                            marginTop:'auto',
                            marginBottom: 'auto',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            fontFamily: 'Lexend-SemiBold',
                            fontSize: 18,
                            color: currentPage == PAGE_TYPE.GUIDES ? 'black' : '#878686',
                        }}>Guides</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        flex: 4, 
                        borderStyle: 'solid',
                        borderColor: 'white',
                        borderBottomColor: currentPage == PAGE_TYPE.ITINERARIES ? 'black' : 'white',
                        borderWidth: 2,
                        }}
                        activeOpacity={0.6}
                        onPress={() => setCurrentPage(PAGE_TYPE.ITINERARIES)}
                        >
                        <Text style={{
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginTop:'auto' ,
                            marginBottom: 'auto',
                            fontFamily: 'Lexend-SemiBold',
                            fontSize: 18,
                            color: currentPage == PAGE_TYPE.ITINERARIES ? 'black' : '#878686',
                        }}>Itineraries</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <MapView
                initialRegion={region}
                region={region}
                ref={mapRef}
                customMapStyle={mapStyle}
                showsUserLocation
                mapPadding={{
                    bottom: 80,
                }}
                provider="google"
                onRegionChangeComplete={handleRegionChange}
                style={styles.map}
            >
                {Object.keys(locationsWithinFrame).map(place_id => {
                  const location = locationsWithinFrame[place_id];
                  if ((currentPage == PAGE_TYPE.GUIDES && location.travelGuides && location.travelGuides.length > 0) || (currentPage == PAGE_TYPE.ITINERARIES && location.itineraries && location.itineraries.length > 0)) {
                    return (<Marker
                      onPress={() => setSelectedLocation(place_id)}
                      key={place_id}
                      coordinate={{
                        latitude: location.latitude,
                        longitude: location.longitude
                      }}
                      // title={location.name}
                    >
                      <Image
                        source={selectedLocation == place_id ? require('../assets/map-marker-white.png') : require('../assets/map-marker-black.png')}
                        style={{width: 45, height: 59}}
                        resizeMode="center"
                        resizeMethod="scale"
                      />
                    </Marker>)
                  }
                })}
            </MapView>
            
            <BottomSheet
                style={{zIndex: 1}}
                ref={sheetRef}
                snapPoints={[windowHeight - 140, 80]}
                initialSnap={1}
                renderContent={renderBottomSheetContent}
                backdropComponent={renderBottomSheetBackdrop}
                renderHeader={renderBottomSheetHeader}
                overdragResistanceFactor={false}
                enabledInnerScrolling={true}
                enabledContentGestureInteraction={false}
            /></>}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    topView: {
        backgroundColor: 'white',
        height: 130,
        width: '100%',
        flexDirection: 'column',
        zIndex: 10000000
    },
    searchBarContainer: {
        backgroundColor: 'white',
        width: '85%',
        flex: 1,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 20,
        shadowColor: '#000',
        borderRadius: 30,
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.7,
        shadowRadius: 4,
        elevation: 10,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15
    },
    tabsContainer: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        marginTop: 10,
    },
    map: {
        flex: 1,
    },
    stripIcon: {
        width: 45,
        backgroundColor: 'grey',
        height: 4,
        borderRadius: 50,
        marginLeft: 'auto',
        marginRight: 'auto'
    }
});

const mapStyle = [
  {
      "featureType": "all",
      "elementType": "labels.text",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "all",
      "elementType": "labels.icon",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "landscape",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#c6e8d0"
          }
      ]
  },
  {
      "featureType": "landscape.man_made",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "visibility": "on"
          },
          {
              "gamma": "1.19"
          }
      ]
  },
  {
      "featureType": "landscape.man_made",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "visibility": "on"
          },
          {
              "gamma": "0.00"
          },
          {
              "weight": "2.07"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#b2ac83"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "color": "#b2ac83"
          }
      ]
  },
  {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#8ac0c4"
          }
      ]
  }
]