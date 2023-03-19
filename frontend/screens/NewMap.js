import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import MapView, {Marker} from 'react-native-maps';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';
import {Dimensions} from 'react-native';
import ip from '../ip';
import Searchbar from '../components/home/Searchbar';
import BottomInfoCard from '../components/BottomInfoCard';
import TopInfoCard from '../components/TopInfoCard';
import SeekBar from '../components/SeekBar';

//bottom sheet header
import ContentsWithinAreaHeader from '../components/home/bottomSheetHeader/ContentsWithinArea';
import ContentsForLocationHeader from '../components/home/bottomSheetHeader/ContentsForLocation';
import ContentsForItineraryHeader from '../components/home/bottomSheetHeader/ContentsForDetailedIti';
import ContentsForRatingHeader from '../components/home/bottomSheetHeader/ContentsForRating';

//bottom sheet content
import ContentsWithinAreaContent from '../components/home/bottomSheetContent/ContentsWithinArea';
import ContentsForLocationContent from '../components/home/bottomSheetContent/ContentsForLocation';
import ContentsForItineraryContent from '../components/home/bottomSheetContent/ContentsForDetailedIti';
import ContentsForRatingContent from '../components/home/bottomSheetContent/ContentsForRating';

export default function NewMap({navigation, userId, route}) {
  const [region, setRegion] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const userLocationRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [audioTime, setAudioTime] = useState(0);

  //for detail itinerary screen
  const [showDetailIti, setShowDetailIti] = useState(false);
  const [runningRoute, setRunningRoute] = useState(false);
  const [showDirection, setShowDirection] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [prevType, setPrevType] = useState(null);
  const [tgMarkers, setTgMarkers] = useState([]);
  const [runningIds, setRunningIds] = useState([]);
  const [tgNumber, setTgNumber] = useState(0);
  const [nextRouteInfo, setNextRouteInfo] = useState(null);
  const [directionIdx, setDirectionIdx] = useState(0);
  const [destinationDistance, setDestinationDistance] = useState(null);
  const [dirDistance, setDirDistance] = useState(null);
  const [itiTg, setItiTg] = useState([]);
  const [showRating, setShowRating] = useState(false);
  const isOnTrack = useRef(false);
  const directionIdxRef = useRef(0);
  const expectedIdxRef = useRef(0);
  const expectedCoordRef = useRef(null);
  const distanceRef = useRef(null);
  const destinationCoord = useRef(null);

  //for rating screen
  const [ratingValue, setRatingValue] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [locationsWithinFrame, setLocationsWithinFrame] = useState([]);
  const locationNumber = useRef([]);
  const mapKey = 'AIzaSyCsdtGfQpfZc7tbypPioacMv2y7eMoaW6g';

  function handleRegionChange(val) {
    setRegion(val);
  }

  const SPECIAL_SCREEN_TYPE = {
    TRAVEL_GUIDE_NAVIGATION: 'travelGuideNavigation',
  };

  const [currentSpecialScreen, setCurrentSpecialScreen] = useState(null);

  const BOTTOM_SHEET_TYPE = {
    CONTENTS_WITHIN_AREA: 'contentsWithinArea',
    CONTENTS_FOR_LOCATION: 'contentsForLocation',
    CONTENTS_FOR_ITINERARY: 'contentsForItinerary',
    CONTENTS_FOR_RATING: 'contentsForRating',
  };
  const [currentBottomSheetType, setCurrentBottomSheetType] = useState(
    BOTTOM_SHEET_TYPE.CONTENTS_WITHIN_AREA,
  );

  const PAGE_TYPE = {
    GUIDES: 'guides',
    ITINERARIES: 'itineraries',
  };
  const [currentPage, setCurrentPage] = useState(PAGE_TYPE.GUIDES);

  const sheetRef = React.useRef(null);
  const mapRef = React.useRef(null);
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;

  const renderBottomSheetBackdrop = () => (
    <Animated.View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}} />
  );

  const getContentBasedOnBottomSheetType = () => {
    if (currentBottomSheetType == BOTTOM_SHEET_TYPE.CONTENTS_WITHIN_AREA) {
      return (
        <ContentsWithinAreaContent
          currentPage={currentPage}
          locationsWithinFrame={locationsWithinFrame}
          navigation={navigation}
          handleUpOverScrollModal={handleUpOverScrollModal}
          windowWidth={windowWidth}
          windowHeight={windowHeight}
          userId={userId}
          setCurrentBottomSheetType={setCurrentBottomSheetType}
          setSelectedItinerary={setSelectedItinerary}
          currentBottomSheetType={currentBottomSheetType}
          setPrevType={setPrevType}
          setShowDetailIti={setShowDetailIti}
          setShowDirection={setShowDirection}
          sheetRef={sheetRef}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          activateTravelGuideNav={activateTravelGuideNav}
        />
      );
    } else if (
      currentBottomSheetType == BOTTOM_SHEET_TYPE.CONTENTS_FOR_LOCATION
    ) {
      return (
        <ContentsForLocationContent
          currentPage={currentPage}
          locationsWithinFrame={locationsWithinFrame}
          navigation={navigation}
          handleUpOverScrollModal={handleUpOverScrollModal}
          locationPlaceId={selectedLocation.placeId}
          windowWidth={windowWidth}
          windowHeight={windowHeight}
          userId={userId}
          setCurrentBottomSheetType={setCurrentBottomSheetType}
          setSelectedItinerary={setSelectedItinerary}
          currentBottomSheetType={currentBottomSheetType}
          setPrevType={setPrevType}
          setShowDetailIti={setShowDetailIti}
          setShowDirection={setShowDirection}
          sheetRef={sheetRef}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          activateTravelGuideNav={activateTravelGuideNav}
        />
      );
    } else if (
      currentBottomSheetType == BOTTOM_SHEET_TYPE.CONTENTS_FOR_ITINERARY
    ) {
      return (
        <ContentsForItineraryContent
          selectedItinerary={selectedItinerary}
          navigation={navigation}
          setTgMarkers={setTgMarkers}
          mapRef={mapRef}
          setRunningIds={setRunningIds}
          setItiTg={setItiTg}
          handleUpOverScrollModal={handleUpOverScrollModal}
          activateTravelGuideNav={activateTravelGuideNav}
        />
      );
    } else if (
      currentBottomSheetType == BOTTOM_SHEET_TYPE.CONTENTS_FOR_RATING
    ) {
      return (
        <ContentsForRatingContent
          submitReview={submitReview}
          setRatingValue={setRatingValue}
          ratingValue={ratingValue}
          submitting={submitting}
        />
      );
    }
  };

  const getHeaderBasedOnBottomSheetType = () => {
    if (currentBottomSheetType == BOTTOM_SHEET_TYPE.CONTENTS_WITHIN_AREA) {
      return (
        <ContentsWithinAreaHeader
          currentPage={currentPage}
          locationsWithinFrame={locationsWithinFrame}
          windowWidth={windowWidth}
          windowHeight={windowHeight}
          handleExitContentsForLocation={handleExitContentsForLocation}
        />
      );
    } else if (
      currentBottomSheetType == BOTTOM_SHEET_TYPE.CONTENTS_FOR_LOCATION
    ) {
      return (
        <ContentsForLocationHeader
          locationName={selectedLocation.name}
          locationImageUrl={selectedLocation.imageUrl}
          sheetRef={sheetRef}
          locationsWithinFrame={locationsWithinFrame}
          locationPlaceId={selectedLocation.placeId}
          currentPage={currentPage}
        />
      );
    } else if (
      currentBottomSheetType == BOTTOM_SHEET_TYPE.CONTENTS_FOR_ITINERARY
    ) {
      return (
        <ContentsForItineraryHeader
          selectedItinerary={selectedItinerary}
          setCurrentBottomSheetType={setCurrentBottomSheetType}
          prevType={prevType}
          setRunningRoute={setRunningRoute}
          setShowDetailIti={setShowDetailIti}
          setShowDirection={setShowDirection}
          sheetRef={sheetRef}
        />
      );
    } else if (
      currentBottomSheetType == BOTTOM_SHEET_TYPE.CONTENTS_FOR_RATING
    ) {
      return <ContentsForRatingHeader />;
    }
  };

  // For BottomSheet.
  const renderBottomSheetContent = () => (
    <View
      style={{
        backgroundColor: 'white',
        zIndex: 1,
        height:
          currentBottomSheetType == BOTTOM_SHEET_TYPE.CONTENTS_FOR_LOCATION
            ? windowHeight - 210
            : currentBottomSheetType == BOTTOM_SHEET_TYPE.CONTENTS_WITHIN_AREA
            ? windowHeight - 180
            : 'auto',
        paddingBottom: 10,
      }}>
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
      }}>
      <View style={styles.stripIcon} />
      {getHeaderBasedOnBottomSheetType()}
    </View>
  );

  // Modal is being overscrolled upwards, hence, close the modal.
  const handleUpOverScrollModal = () => {
    handleExitContentsForLocation();
  };

  const activateTravelGuideNav = travelGuide => {
    setCurrentSpecialScreen(SPECIAL_SCREEN_TYPE.TRAVEL_GUIDE_NAVIGATION);
    setShowDirection(true);
    setItiTg([travelGuide]);
    setTgMarkers([
      {
        id: travelGuide._id,
        latitude: travelGuide.coordinates.lat,
        longitude: travelGuide.coordinates.lng,
      },
    ]);
    setRunningIds([`place_id:${travelGuide.placeId}`]);
    setRunningRoute(true);
  };

  const deactivateTravelGuideNav = () => {
    setCurrentSpecialScreen(null);
    setCurrentBottomSheetType(BOTTOM_SHEET_TYPE.CONTENTS_WITHIN_AREA);
    setShowDetailIti(false);
    setShowDirection(false);
  };

  //get route params
  useEffect(() => {
    navigation.addListener('focus', () => {
      if (route.params) {
        if (route.params.type == BOTTOM_SHEET_TYPE.CONTENTS_FOR_ITINERARY) {
          const {itinerary, type, showIti, showDir} = route.params;
          setSelectedItinerary(itinerary);
          setCurrentBottomSheetType(type);
          setShowDetailIti(showIti);
          setShowDirection(showDir);
          sheetRef.current.snapTo(1);
          return;
        }

        if (route.params.type == SPECIAL_SCREEN_TYPE.TRAVEL_GUIDE_NAVIGATION) {
          const {travelGuide, type} = route.params;
          activateTravelGuideNav(travelGuide);
        }
      }
    });
  }, [route.params]);

  useEffect(() => {
    // get user position and set region to focus on user's position.
    Geolocation.getCurrentPosition(
      pos => {
        setRegion({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        userLocationRef.current = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
      },
      err => Alert.alert("Unable to get user's current position"),
      {
        enableHighAccuracy: true,
      },
    );
  }, []);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        if (runningRoute && isOnTrack.current) {
          let range = getDistance(
            latitude,
            longitude,
            destinationCoord.current.lat,
            destinationCoord.current.lng,
          );
          setDestinationDistance(Math.round(range));
          if (range <= 100) {
            setShowDirection(false);
            destinationCoord.current = null;
            setDestinationDistance(0);
            isOnTrack.current = false;
            expectedIdxRef.current = 0;
            directionIdxRef.current = 0;
            setDirectionIdx(0);
            distanceRef.current = null;
            return;
          }
          //check if user is on track
          const testD = Math.round(
            getDistance(
              latitude,
              longitude,
              expectedCoordRef.current[expectedIdxRef.current].latitude,
              expectedCoordRef.current[expectedIdxRef.current].longitude,
            ),
          );
          if (distanceRef.current == null || distanceRef.current >= testD)
            distanceRef.current = testD;
          else if (distanceRef.current < testD) {
            isOnTrack.current = false;
            distanceRef.current = null;
            return;
          }
          //contantly update user and destination distance
          const desD = Math.round(
            getDistance(
              latitude,
              longitude,
              nextRouteInfo[directionIdxRef.current].end_location.lat,
              nextRouteInfo[directionIdxRef.current].end_location.lng,
            ),
          );
          setDirDistance(desD);
          console.log(
            'lat: ' +
              latitude +
              ' long: ' +
              longitude +
              ' distance: ' +
              desD +
              'm',
          );
          if (
            testD <= 20 &&
            expectedIdxRef.current < expectedCoordRef.current.length - 1
          ) {
            expectedIdxRef.current++;
            distanceRef.current = null;
          }
          if (
            desD <= 20 &&
            directionIdxRef.current < nextRouteInfo.length - 1
          ) {
            directionIdxRef.current++;
            setDirectionIdx(directionIdxRef.current);
          }
        }
        setUserLocation({
          latitude: latitude,
          longitude: longitude,
        });
        userLocationRef.current = {
          latitude: latitude,
          longitude: longitude,
        };
      },
      error => console.log(error),
      {enableHighAccuracy: true, distanceFilter: 10},
    );

    return () => Geolocation.clearWatch(watchId);
  }, [runningRoute, nextRouteInfo]);

  const getPlacesWithinFrame = async () => {
    const {northEast, southWest} = await mapRef.current.getMapBoundaries();

    // calculate radius.
    let radius = 0;
    if (
      northEast.latitude == 0 &&
      northEast.longitude == 0 &&
      southWest.latitude == 0 &&
      southWest.longitude == 0
    ) {
      // TODO: this is bad. need to find out how to get correct radius when getMapBoundaries is not
      // activated yet (i.e., returns 0 for everything). the current value is dependant on the initialRegion
      // having latitudeDelta and longitudeDelta both equal to 0.01.
      radius = 0.01;
    } else {
      const latDiff = Math.abs(northEast.latitude - southWest.latitude);
      const lngDiff = Math.abs(northEast.longitude - southWest.longitude);
      radius = Math.max(latDiff, lngDiff) / 2;
    }

    let response = await fetch(
      `http://${ip.ip}:8000/travelGuide/byCoordinates?maxLat=${
        region.latitude + radius
      }&maxLng=${region.longitude + radius}&minLat=${
        region.latitude - radius
      }&minLng=${region.longitude - radius}`,
      {
        credentials: 'include',
        method: 'GET',
      },
    );
    const data = await response.json();
    return data;
  };

  const getImageUrlFromPhotoReference = photoRef => {
    return `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoRef}&sensor=false&maxheight=500&maxwidth=500&key=${mapKey}`;
  };

  const handleExitContentsForLocation = () => {
    sheetRef.current.snapTo(2);
    setCurrentBottomSheetType(BOTTOM_SHEET_TYPE.CONTENTS_WITHIN_AREA);
    setSelectedLocation(null);
  };

  useEffect(() => {
    if (region && showDetailIti == false) {
      getPlacesWithinFrame().then(async res => {
        const locationsData = res.data;
        locationNumber.current = Object.keys(locationsData).length;
        setLocationsWithinFrame(locationsData);
      });
    }
  }, [region, showDetailIti]);

  useEffect(() => {
    if (sheetRef.current && locationNumber.current == 0) {
      sheetRef.current.snapTo(2);
    }
  }, [locationNumber.current]);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // distance in km
    return d * 1000; // distance in m
  };
  const deg2rad = deg => {
    return deg * (Math.PI / 180);
  };
  const routeFunction = result => {
    if (runningRoute) {
      if (!isOnTrack.current) {
        setNextRouteInfo(result.legs[0].steps);
        directionIdxRef.current = 0;
        setDirectionIdx(0);
        expectedIdxRef.current = 0;
        isOnTrack.current = true;
        expectedCoordRef.current = result.coordinates;
        let distance = getDistance(
          userLocationRef.current.latitude,
          userLocationRef.current.longitude,
          expectedCoordRef.current[0].latitude,
          expectedCoordRef.current[0].longitude,
        );
        distanceRef.current = Math.round(distance);
      }
      if (destinationCoord.current == null) {
        destinationCoord.current =
          result.legs[0].steps[result.legs[0].steps.length - 1].end_location;
        distance = getDistance(
          userLocationRef.current.latitude,
          userLocationRef.current.longitude,
          destinationCoord.current.lat,
          destinationCoord.current.lng,
        );
        if (distance < 100) {
          setDestinationDistance(null);
          setShowDirection(false);
        } else setDestinationDistance(Math.round(distance));
      }
    }
  };
  function resetRouteVariables() {
    destinationCoord.current = null;
    isOnTrack.current = false;
    expectedIdxRef.current = 0;
    directionIdxRef.current = 0;
    distanceRef.current = null;
    expectedCoordRef.current = null;
    setDestinationDistance(null);
    setDirectionIdx(0);
    setTgNumber(0);
    setNextRouteInfo(null);
    const coordinates = [];
    tgMarkers.map(tg => {
      coordinates.push({
        latitude: tg.latitude,
        longitude: tg.longitude,
      });
    });
    mapRef.current.fitToCoordinates(coordinates, {
      edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
      animated: true,
    });
  }

  async function submitReview() {
    setSubmitting(true);
    const avgRating =
      (selectedItinerary.rating * selectedItinerary.ratingCount + ratingValue) /
      (selectedItinerary.ratingCount + 1);
    const stringify = JSON.stringify(selectedItinerary.travelGuideId);
    await axios
      .post(`http://${ip.ip}:8000/itinerary/`, {
        name: selectedItinerary.name,
        itineraryId: selectedItinerary._id,
        rating: avgRating,
        ratingCount: selectedItinerary.ratingCount + 1,
        travelGuideId: stringify,
        creatorId: selectedItinerary.creatorId,
        description: selectedItinerary.description,
        imageUrl: selectedItinerary.imageUrl,
      })
      .then(res => {
        if (res.data.success) {
          const updated = res.data.result;
          setSubmitting(false);
          setShowRating(false);
          setRatingValue(0);
          setSelectedItinerary(prev => {
            return {
              ...prev,
              rating: updated.rating,
              ratingCount: updated.ratingCount,
            };
          });
        }
        setCurrentBottomSheetType(BOTTOM_SHEET_TYPE.CONTENTS_FOR_ITINERARY);
      })
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      {region && (
        <>
          {runningRoute && (
            <BottomInfoCard
              tgNumber={tgNumber}
              nextRouteInfo={nextRouteInfo}
              tg={itiTg}
              showDirection={showDirection}
              expIdx={expectedIdxRef}
              directionIdx={directionIdx}
              dirDistance={dirDistance}
              destinationDistance={destinationDistance}
              resetRouteVariables={resetRouteVariables}
              setRunningIti={setRunningRoute}
              setShowDirection={setShowDirection}
              setCurrentBottomSheetType={setCurrentBottomSheetType}
              currentSpecialScreen={currentSpecialScreen}
              setCurrentSpecialScreen={setCurrentSpecialScreen}
              deactivateTravelGuideNav={deactivateTravelGuideNav}
              setAudioTime={setAudioTime}
            />
          )}
          {runningRoute && !showDirection && (
            <SeekBar
              currentAudioTime={audioTime}
              setAudioTime={setAudioTime}
              itiTg={itiTg}
              tgNumber={tgNumber}
            />
          )}
          {runningRoute && (
            <TopInfoCard
              tg={itiTg}
              tgNumber={tgNumber}
              setTgNumber={setTgNumber}
              setRunningIti={setRunningRoute}
              setShowDirection={setShowDirection}
              resetRouteVariables={resetRouteVariables}
              currentSpecialScreen={currentSpecialScreen}
              destinationCoord={destinationCoord}
              setCurrentSpecialScreen={setCurrentSpecialScreen}
              setCurrentBottomSheetType={setCurrentBottomSheetType}
              deactivateTravelGuideNav={deactivateTravelGuideNav}
              setAudioTime={setAudioTime}
            />
          )}
          {!showDirection && !runningRoute && (
            <View style={styles.topView}>
              <View
                style={{
                  width: '85%',
                  flex: 1,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginTop: 20,
                  padding: 0,
                  position: 'relative',
                }}>
                <View
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: 500,
                  }}>
                  <Searchbar
                    getImageUrlFromPhotoReference={
                      getImageUrlFromPhotoReference
                    }
                    mapKey={mapKey}
                    region={region}
                    setSelectedLocation={setSelectedLocation}
                    setCurrentBottomSheetType={setCurrentBottomSheetType}
                    mapRef={mapRef}
                  />
                </View>
              </View>
              <View style={styles.tabsContainer}>
                <TouchableOpacity
                  style={{
                    flex: 4,
                    borderStyle: 'solid',
                    borderColor: 'white',
                    borderBottomColor:
                      currentPage == PAGE_TYPE.GUIDES ? 'black' : 'white',
                    borderWidth: 2,
                  }}
                  onPress={() => {
                    setCurrentPage(PAGE_TYPE.GUIDES);
                    setIsLoading(true);
                  }}
                  activeOpacity={0.6}>
                  <Text
                    style={{
                      marginTop: 'auto',
                      marginBottom: 'auto',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      fontFamily: 'Lexend-SemiBold',
                      fontSize: 18,
                      color:
                        currentPage == PAGE_TYPE.GUIDES ? 'black' : '#878686',
                    }}>
                    Guides
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 4,
                    borderStyle: 'solid',
                    borderColor: 'white',
                    borderBottomColor:
                      currentPage == PAGE_TYPE.ITINERARIES ? 'black' : 'white',
                    borderWidth: 2,
                  }}
                  activeOpacity={0.6}
                  onPress={() => {
                    setCurrentPage(PAGE_TYPE.ITINERARIES);
                    setIsLoading(true);
                  }}>
                  <Text
                    style={{
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      marginTop: 'auto',
                      marginBottom: 'auto',
                      fontFamily: 'Lexend-SemiBold',
                      fontSize: 18,
                      color:
                        currentPage == PAGE_TYPE.ITINERARIES
                          ? 'black'
                          : '#878686',
                    }}>
                    Itineraries
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          <MapView
            initialRegion={region}
            // region={region}
            ref={mapRef}
            customMapStyle={mapStyle}
            showsUserLocation
            mapPadding={{
              bottom: 80,
            }}
            provider="google"
            onRegionChangeComplete={handleRegionChange}
            style={styles.map}>
            {(showDetailIti ||
              currentSpecialScreen ==
                SPECIAL_SCREEN_TYPE.TRAVEL_GUIDE_NAVIGATION) &&
              runningIds.length > 0 &&
              runningIds.map((id, index) => {
                return (
                  <MapViewDirections
                    key={id}
                    apikey="AIzaSyBTu-eAg_Ou65Nzk3-2tvGjbg9rcC2_M3I"
                    strokeWidth={3}
                    strokeColor="black"
                    origin={
                      runningRoute
                        ? userLocation
                        : index == 0
                        ? userLocation
                        : runningIds[index - 1]
                    }
                    destination={runningRoute ? runningIds[tgNumber] : id}
                    mode="WALKING"
                    resetOnChange={false}
                    onReady={routeFunction}
                  />
                );
              })}
            {runningRoute && (
              <Marker
                coordinate={{
                  latitude: tgMarkers[tgNumber].latitude,
                  longitude: tgMarkers[tgNumber].longitude,
                }}>
                <Image
                  source={require('../assets/map-marker-black.png')}
                  style={{width: 45, height: 50}}
                  resizeMode="cover"
                  resizeMethod="auto"
                />
              </Marker>
            )}
            {showDetailIti &&
              !runningRoute &&
              tgMarkers.map((marker, index) => {
                return (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: marker.latitude,
                      longitude: marker.longitude,
                    }}>
                    <Image
                      source={require('../assets/map-marker-black.png')}
                      style={{width: 45, height: 50}}
                      resizeMode="cover"
                      resizeMethod="auto"
                    />
                  </Marker>
                );
              })}
            {!showDetailIti &&
            !currentSpecialScreen &&
            currentBottomSheetType == BOTTOM_SHEET_TYPE.CONTENTS_WITHIN_AREA
              ? Object.keys(locationsWithinFrame).map(place_id => {
                  const location = locationsWithinFrame[place_id];
                  if (
                    (currentPage == PAGE_TYPE.GUIDES &&
                      location.travelGuides &&
                      location.travelGuides.length > 0) ||
                    (currentPage == PAGE_TYPE.ITINERARIES &&
                      location.itineraries &&
                      location.itineraries.length > 0)
                  ) {
                    return (
                      <Marker
                        onPress={async () => {
                          // Get image info.
                          const response = await fetch(
                            `https://maps.googleapis.com/maps/api/place/details/json?placeid=${place_id}&key=${mapKey}`,
                          );
                          const placeInfo = await response.json();
                          let imageUrl =
                            'https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png';
                          if (
                            placeInfo.result &&
                            placeInfo.result.photos &&
                            placeInfo.result.photos.length > 0
                          ) {
                            imageUrl = getImageUrlFromPhotoReference(
                              placeInfo.result.photos[0].photo_reference,
                            );
                          }

                          setSelectedLocation({
                            placeId: place_id,
                            latitude: location.latitude,
                            longitude: location.longitude,
                            imageUrl: imageUrl,
                            name: location.name,
                          });
                          setCurrentBottomSheetType(
                            BOTTOM_SHEET_TYPE.CONTENTS_FOR_LOCATION,
                          );
                        }}
                        key={place_id}
                        coordinate={{
                          latitude: location.latitude,
                          longitude: location.longitude,
                        }}>
                        <Image
                          source={require('../assets/map-marker-black.png')}
                          style={{width: 45, height: 50}}
                          resizeMode="cover"
                          resizeMethod="auto"
                        />
                      </Marker>
                    );
                  }
                })
              : selectedLocation && (
                  <Marker
                    onPress={() => {
                      handleExitContentsForLocation();
                    }}
                    key={selectedLocation.placeId}
                    coordinate={{
                      latitude: selectedLocation.latitude,
                      longitude: selectedLocation.longitude,
                    }}>
                    <Image
                      source={require('../assets/map-marker-white.png')}
                      style={{width: 45, height: 50}}
                      resizeMode="cover"
                      resizeMethod="auto"
                    />
                  </Marker>
                )}
          </MapView>

          {!runningRoute && (
            <BottomSheet
              style={{zIndex: 1}}
              ref={sheetRef}
              snapPoints={[
                currentBottomSheetType == BOTTOM_SHEET_TYPE.CONTENTS_WITHIN_AREA
                  ? windowHeight - 140
                  : currentBottomSheetType ==
                    BOTTOM_SHEET_TYPE.CONTENTS_FOR_LOCATION
                  ? windowHeight - 190
                  : windowHeight - 50,
                300,
                80,
              ]}
              initialSnap={
                currentBottomSheetType == BOTTOM_SHEET_TYPE.CONTENTS_FOR_RATING
                  ? 1
                  : 2
              }
              renderContent={renderBottomSheetContent}
              backdropComponent={renderBottomSheetBackdrop}
              renderHeader={renderBottomSheetHeader}
              overdragResistanceFactor={false}
              enabledInnerScrolling={true}
              enabledContentGestureInteraction={false}
              onCloseEnd={() => {
                // BottomSheet is being closed. If the current bottomsheet type
                // is BOTTOM_SHEET_TYPE.CONTENTS_FOR_LOCATION, we need to toggle
                // it.
                if (!showDetailIti) handleExitContentsForLocation();
              }}
              enabledHeaderGestureInteraction={
                (locationNumber.current > 0 || showDirection) &&
                currentBottomSheetType !== BOTTOM_SHEET_TYPE.CONTENTS_FOR_RATING
                  ? true
                  : false
              }
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
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
    zIndex: 1000,
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
    paddingRight: 15,
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
    marginRight: 'auto',
  },
});

const mapStyle = [
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{color: 'black'}],
  },
  // {
  //   featureType: 'poi',
  //   elementType: 'labels.icon',
  //   stylers: [
  //     {
  //       visibility: 'off',
  //     },
  //   ],
  // },
  {
    featureType: 'landscape',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#c6e8d0',
      },
    ],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry.fill',
    stylers: [
      {
        visibility: 'on',
      },
      {
        gamma: '1.19',
      },
    ],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry.stroke',
    stylers: [
      {
        visibility: 'on',
      },
      {
        gamma: '0.00',
      },
      {
        weight: '2.07',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#b2ac83',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#b2ac83',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#8ac0c4',
      },
    ],
  },
];
