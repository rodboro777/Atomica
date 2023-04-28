import React, { useEffect, useState, useRef } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Alert,
  Pressable,
  FlatList,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  Animated,
  TouchableOpacity,
} from 'react-native'; // Import Map and Marker
import TopInfoCard from '../components/TopInfoCard';
import BottomInfoCard from '../components/BottomInfoCard';
import RatingStars from '../components/RatingStars';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, Circle } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
import { FloatingAction } from 'react-native-floating-action';
import Modal from 'react-native-modal';
import PlayIcon from '../assets/play_1.png';
import PauseIcon from '../assets/pause.png';
import Arrow from '../assets/arrow.png';
import axios from 'axios';
import SoundPlayer from 'react-native-sound-player';
import ip from '../ip';
import RNFetchBlob from 'rn-fetch-blob';



const Map = () => {
  Geolocation.requestAuthorization();
  const modalAni = useRef(
    new Animated.Value(Dimensions.get('window').height / 1.5),
  ).current;
  const [coordinate, setCoordinate] = useState({
    latitude: 53.9854,
    longitude: -6.3945,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [region, setRegion] = useState({
    latitude: 53.9854,
    longitude: -6.3945,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [temp, setTemp] = useState({
    latitude: 53.9854,
    longitude: -6.3945,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [runningIti, setRunningIti] = useState(false);
  const [isLight, setLight] = useState(true);
  const [ratingValue, setRatingValue] = useState(0);
  const ratingMap = {
    0: 'No rating',
    1: '★',
    2: '★★',
    3: '★★★',
    4: '★★★★',
    5: '★★★★★',
  };
  const [showMarker, setShowMarker] = useState(false);
  const [showDetailIti, setShowDetailIti] = useState(false);
  const [selectedIti, setSelectedIti] = useState(null);
  const [showTg, setShowTg] = useState(true);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [showDirection, setShowDirection] = useState(false);
  const [screenState, setScreenState] = useState('half');
  const [showRating, setShowRating] = useState(false);
  const [userLocation, setUserLocation] = useState({
    latitude: 53.9854,
    longitude: -6.3945,
  });
  const [destinationInfo, setDestinationInfo] = useState([]);
  const [nextRouteInfo, setNextRouteInfo] = useState(null);
  const [dirDistance, setDirDistance] = useState(0);
  const [directionIdx, setDirectionIdx] = useState(0);
  const [destinationDistance, setDestinationDistance] = useState(null);
  const [tgNumber, setTgNumber] = useState(0);
  const placeRef = useRef(null);
  const directionIdxRef = useRef(0);
  const mapRef = useRef(null);
  const distance = useRef(null);
  const expectedCoords = useRef(null);
  const isOnTrack = useRef(false);
  const expIdx = useRef(0);
  const destinationCoord = useRef(null);
  const userLocationRef = useRef(null);
  const [photo, setPhoto] = useState(
    'ARywPAI4CheuR7nthP4lUNuQw09LqBIfNHSNdfgmBuUA7SdwUjkkiWwEJGcbueamM-zxmpJ7HC8yvx-w3GUczlThnPkC6-llma_MPNGPQbGo1R0SGGaUIUUiruARLrwesAJYrbxiADZib5tT1o-k_JvNdQyx91hxav_VDmaaNfshPjvQygi7',
  );
  //const key = 'AIzaSyBdUF2aSzhP3mzuRhFXZwl5lxBTavQnH7M';
  const key = 'AIzaSyBCRkWTNumRm0kjDmC8V25s0oiPpmxZoY0';
  const url =
    'https://maps.googleapis.com/maps/api/place/photo?photoreference=' +
    photo +
    '&sensor=false&maxheight=500&maxwidth=500&key=' +
    key;
  const [description, setDescription] = useState('');

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState([null, false]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [travelGuides, setTravelGuides] = useState([]);
  const [itiTg, setItiTg] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [runningIds, setRunningIds] = useState([]);
  const [tgMarkers, setTgMarkers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const shadowOpt = {
    width: 160,
    height: 170,
    color: '#000',
    border: 2,
    radius: 3,
    opacity: 0.2,
    x: 0,
    y: 3,
    style: { marginVertical: 5 },
  };

  const toggleModal = e => {
    if (e.swipingDirection === 'up') {
      setScreenState('full');
      Animated.timing(modalAni, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      if (screenState === 'full') {
        setScreenState('half');
        Animated.timing(modalAni, {
          toValue: Dimensions.get('window').height / 1.5,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else if (screenState === 'half') {
        setModalVisible(false);
        modalAni.setValue(Dimensions.get('window').height / 1.5);
      }
    }
  };
  const actions = [
    {
      text: 'Current Location',
      name: 'Geolocation',
      icon: require('../assets/gps.png'),
      position: 1,
    },
    {
      text: 'Brightness Mode',
      name: 'Brightness',
      icon: isLight
        ? require('../assets/dark_mode.png')
        : require('../assets/light_mode.png'),
      position: 2,
    },
  ];

  const getCurrentPosition = async () => {
    setShowMarker(false);
    //await requestLocationPermission()
    Geolocation.getCurrentPosition(
      pos => {
        console.log('curr: ' + JSON.stringify(pos));
        console.log('curr lng: ' + JSON.stringify(pos.coords.longitude));
        setTemp({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.01,
        });
        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      error => Alert.alert('GetCurrentPosition Error', JSON.stringify(error)),
      { enableHighAccuracy: true },
    );
  };

  // get the usernames of the creators of the given travel guides.
  const getUsernames = async docs => {
    const promises = [];
    for (let i = 0; i < docs.length; i++) {
      let res = await axios.get(
        `http://${ip.ip}:8000/user/username?id=${docs[i].creatorId}`,
      );
      let username = await res.data.username;
      promises.push(username);
    }
    const usernames = await Promise.all(promises);
    return usernames;
  };

  function showItiDetail(item) {
    if (screenState === 'full') {
      setScreenState('half');
      Animated.timing(modalAni, {
        toValue: Dimensions.get('window').height / 1.5,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    getTravelGuidesFromItinerary(item.travelGuideId);
    setSelectedIti(item);
    setShowDetailIti(true);
    setShowMarker(false);
    setShowTg(true);
    setShowDirection(true);
  }

  const renderItem = ({ item }) => {
    return (
      <Pressable
        style={styles.itemWrapperStyle}
        onPress={() => {
          if (!showTg) {
            showItiDetail(item);
          } else togglePlayAudio(item);
        }}>
        <View style={styles.contentWrapperStyle}>
          <Text style={styles.txtNameStyle}>{`${item.name}`}</Text>
          <Text style={styles.txtEmailStyle}>{item.username}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            showTg ? togglePlayAudio(item) : showItiDetail(item);
          }}
          style={{
            marginTop: 'auto',
            marginBottom: 'auto',
            height: 35,
            width: 35,
          }}>
          <Image
            source={
              showTg
                ? currentlyPlaying[0] == item._id && currentlyPlaying[1]
                  ? PauseIcon
                  : PlayIcon
                : Arrow
            }
            style={{
              height: '100%',
              tintColor: 'black',
              width: '100%',
            }}
          />
        </TouchableOpacity>
      </Pressable>
    );
  };

  async function togglePlayAudio(tg) {
    if (currentlyPlaying[0] == null || currentlyPlaying[0] != tg._id) {
      setLoadingAudio(true);
      await SoundPlayer.stop();
      setCurrentlyPlaying([tg._id, true]);
      await SoundPlayer.loadUrl(tg.audioUrl);
      await SoundPlayer.play();
    } else if (currentlyPlaying[1]) {
      setCurrentlyPlaying([tg._id, false]);
      await SoundPlayer.pause();
    } else {
      setCurrentlyPlaying([tg._id, true]);
      await SoundPlayer.resume();
    }
  }
  useEffect(() => {
    SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
      setCurrentlyPlaying([null, false]);
    });
  }, []);
  useEffect(() => {
    SoundPlayer.addEventListener('FinishedLoading', ({ success }) => {
      setLoadingAudio(false);
    });
  }, []);
  const renderLoader = () => {
    return isLoading ? (
      <View style={styles.loaderStyle}>
        <ActivityIndicator size="large" color="#aaa" />
      </View>
    ) : null;
  };
  const loadMoreItem = () => {
    setCurrentPage(currentPage + 1);
  };

  async function getTravelGuidesAndItineraries(placeId) {
    await axios
      .get(`http://${ip.ip}:8000/travelGuide/byLocation?placeId=${placeId}`)
      .then(async res => {
        const results = res.data.results;
        let tg = results.map(result => {
          return {
            _id: result._id,
            name: result.name,
            creatorId: result.creatorId,
            audioUrl: result.audioUrl,
            placeId: result.placeId,
            description: result.description,
            imageUrl: result.imageUrl,
            audioLength: result.audioLength,
            public: result.public,
          };
        });
        let it = [];
        for (let i = 0; i < results.length; i++) {
          for (let j = 0; j < results[i].itineraries.length; j++) {
            it.push(results[i].itineraries[j]);
          }
        }
        const tgUsername = await getUsernames(tg);
        const itUsername = await getUsernames(it);
        let modifiedTg = [];
        for (let i = 0; i < tgUsername.length; i++) {
          modifiedTg.push({ ...tg[i], username: tgUsername[i] });
        }
        let modifiedIt = [];
        for (let i = 0; i < itUsername.length; i++) {
          modifiedIt.push({ ...it[i], username: itUsername[i] });
        }
        setTravelGuides(modifiedTg);
        setItineraries(modifiedIt);
      })
      .catch(err => {
        console.log(err);
      });
  }

  async function getTravelGuidesFromItinerary(travelGuideId) {
    await axios
      .post(`http://${ip.ip}:8000/travelGuide/byIds`, travelGuideId)
      .then(async res => {
        const results = res.data.travelGuides;
        let tg = results.map(result => {
          return {
            _id: result._id,
            name: result.name,
            creatorId: result.creatorId,
            audioUrl: result.audioUrl,
            placeId: result.placeId,
            description: result.description,
            imageUrl: result.imageUrl,
            audioLength: result.audioLength,
            public: result.public,
          };
        });
        const tgUsername = await getUsernames(tg);
        let modifiedTg = [];
        for (let i = 0; i < tgUsername.length; i++) {
          modifiedTg.push({ ...tg[i], username: tgUsername[i] });
        }
        const ids = [];
        modifiedTg.map(tg => {
          ids.push(`place_id:${tg.placeId}`);
        });
        const coordinates = [];
        coordinates.push(userLocation);
        for (let i = 0; i < modifiedTg.length; i++) {
          let res = await axios.get(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${modifiedTg[i].placeId}&key=AIzaSyCsdtGfQpfZc7tbypPioacMv2y7eMoaW6g`,
          );
          let data = res.data.result;
          setDestinationInfo(prev => {
            return [
              ...prev,
              {
                name: data.name,
                imageUrl:
                  'https://maps.googleapis.com/maps/api/place/photo?photoreference=' +
                  data.photos[0].photo_reference +
                  '&sensor=false&maxheight=500&maxwidth=500&key=AIzaSyBTu-eAg_Ou65Nzk3-2tvGjbg9rcC2_M3I',
              },
            ];
          });
          coordinates.push({
            latitude: data.geometry.location.lat,
            longitude: data.geometry.location.lng,
          });
          setTgMarkers(prev => {
            return [
              ...prev,
              {
                id: data.place_id,
                name: data.name,
                description: data.description,
                latitude: data.geometry.location.lat,
                longitude: data.geometry.location.lng,
              },
            ];
          });
        }
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
        setRunningIds(ids);
        setItiTg(modifiedTg);
      })
      .catch(err => {
        console.log(err);
      });
  }

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

  useEffect(() => {
    Geolocation.getCurrentPosition(
      pos => {
        setTemp({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
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
      error => Alert.alert('GetCurrentPosition Error', JSON.stringify(error)),
      { enableHighAccuracy: true },
    );
  }, []);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;
        if (runningIti && isOnTrack.current) {
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
            expIdx.current = 0;
            directionIdxRef.current = 0;
            setDirectionIdx(0);
            distance.current = null;
            return;
          }
          //check if user is on track
          const testD = Math.round(
            getDistance(
              latitude,
              longitude,
              expectedCoords.current[expIdx.current].latitude,
              expectedCoords.current[expIdx.current].longitude,
            ),
          );
          if (distance.current == null || distance.current >= testD)
            distance.current = testD;
          else if (distance.current < testD) {
            isOnTrack.current = false;
            distance.current = null;
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
            expIdx.current < expectedCoords.current.length - 1
          ) {
            expIdx.current++;
            distance.current = null;
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
      { enableHighAccuracy: true, distanceFilter: 10 },
    );

    return () => Geolocation.clearWatch(watchId);
  }, [runningIti, nextRouteInfo]);

  function modalSwipeRule() {
    if (screenState === 'full') return 'down';
    else if (showDetailIti) return 'up';
    else return ['up', 'down'];
  }

  function runItinerary() {
    setModalVisible(false);
    setRunningIti(true);
    mapRef.current.animateToRegion({
      ...userLocation,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  }
  function resetRouteVariables() {
    destinationCoord.current = null;
    isOnTrack.current = false;
    expIdx.current = 0;
    directionIdxRef.current = 0;
    distance.current = null;
    expectedCoords.current = null;
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
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      animated: true,
    });
  }

  async function submitReview() {
    setSubmitting(true);
    const avgRating =
      (selectedIti.rating * selectedIti.ratingCount + ratingValue) /
      (selectedIti.ratingCount + 1);
    await axios
      .post(`http://${ip.ip}:8000/itinerary/`, {
        name: selectedIti.name,
        itineraryId: selectedIti._id,
        rating: avgRating,
        ratingCount: selectedIti.ratingCount + 1,
        travelGuideId: selectedIti.travelGuideId,
        creatorId: selectedIti.creatorId,
        description: selectedIti.description,
      })
      .then(res => {
        if (res.data.success) {
          const updated = res.data.result;
          setSubmitting(false);
          setShowRating(false);
          setRatingValue(0);
          setItineraries(prev => {
            return prev.map(itinerary => {
              if (itinerary._id === updated._id) {
                return {
                  ...itinerary,
                  rating: updated.rating,
                  ratingCount: updated.ratingCount,
                };
              }
              return itinerary;
            });
          });
          setSelectedIti(prev => {
            return {
              ...prev,
              rating: updated.rating,
              ratingCount: updated.ratingCount,
            };
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    mapStyle: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
    searchContainer: {
      position: 'absolute',
      width: '90%',
      backgroundColor: 'black',
      padding: 0,
      borderRadius: 8,
      top: StatusBar.currentHeight,
    },
    input: {
      borderBottomColor: '#888',
      borderWidth: 1,
    },
    modal: {
      position: 'relative',
      margin: 0,
      shadowColor: '#52006A',
      elevation: 20,
    },
    modalContent: {
      position: 'absolute',
      width: Dimensions.get('window').width,
      backgroundColor: 'white',
      paddingTop: 12,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      overflow: 'hidden',
      height: Dimensions.get('window').height,
      bottom: -20,
      shadowColor: 'black',
      shadowOffset: {
        width: 200,
        height: 200,
      },
      shadowOpacity: 100,
      shadowRadius: 100,
      elevation: 50,
    },
    center: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      // elevation: showRating ? 0 : 10,
      // shadowOffset: {width: 0, height: 2},
      marginTop: -12,
      shadowColor: 'black',
      shadowOffset: {
        width: 200,
        height: 200,
      },
      shadowOpacity: 100,
      shadowRadius: 100,
      elevation: 10,
    },
    barIcon: {
      width: 60,
      height: 5,
      backgroundColor: '#bbb',
      borderRadius: 3,
      marginTop: 10,
    },
    text: {
      color: '#bbb',
      fontSize: 20,
      marginTop: 100,
    },
    bubble: {
      flexDirection: 'row',
      alignSelf: 'flex-start',
      backgroundColor: 'white',
      borderRadius: 6,
      borderColor: '#ccc',
      borderWidth: 0.5,
      padding: 15,
      width: 150,
    },
    widgetContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 0,
      height: 60,
      width: '100%',
      backgroundColor: '#000',
      marginTop: 0,
      borderRadius: 10,
    },
    widgetMusicTitle: {
      fontSize: 18,
      color: '#fff',
      fontWeight: 'bold',
      marginTop: 12,
      marginHorizontal: 10,
      marginBottom: 1,
    },
    widgetArtisteTitle: {
      fontSize: 14,
      color: '#fff',
      opacity: 0.8,
      marginHorizontal: 10,
      marginBottom: 12,
      marginTop: 1,
    },
    widgetImageStyle: {
      width: 55,
      height: 50,
      marginTop: 9,
      marginLeft: 5,
      borderRadius: 10,
    },
    musicTitle: {
      fontSize: 15,
      color: '#000',
      fontWeight: 'bold',
      marginTop: 1,
      marginHorizontal: 20,
      marginBottom: 1,
    },
    artisteTitle: {
      fontSize: 16,
      color: '#000',
      opacity: 0.8,
      marginHorizontal: 20,
      marginBottom: 1,
      marginTop: 1,
    },
    itemWrapperStyle: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 16,
      justifyContent: 'space-between',
      backgroundColor: 'white',
      marginTop: 10,
      borderRadius: 10,
    },
    itemImageStyle: {
      width: 50,
      height: 50,
      marginRight: 16,
    },
    contentWrapperStyle: {
      justifyContent: 'space-around',
    },
    txtNameStyle: {
      fontSize: 16,
      color: 'black',
      fontFamily: 'Lexend-ExtraBold',
    },
    txtEmailStyle: {
      color: 'black',
      fontFamily: 'Lexend-Regular',
    },
    loaderStyle: {
      marginVertical: 16,
      alignItems: 'center',
    },
    detailItiBackBtn: {
      position: 'absolute',
      top: -10,
      left: 10,
      padding: 10,
    },
    backBtnArrow: {
      fontSize: 30,
      fontWeight: '900',
      color: 'black',
      fontFamily: 'Lexend-ExtraLight',
    },
    startItiButton: {
      position: 'absolute',
      padding: 10,
      right: 10,
      backgroundColor: 'black',
      top: 10,
      borderRadius: 30,
      width: 80,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    startItiWord: {
      color: 'white',
      marginLeft: 'auto',
      marginRight: 'auto',
      fontWeight: 'bold',
      fontSize: 16,
      fontFamily: 'Lexend-ExtraLight',
    },
  });

  const mapStyleLight = [];
  const mapStyleDark = [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#263c3f' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#6b9a76' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#38414e' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#212a37' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9ca5b3' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#746855' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#1f2835' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#f3d19c' }],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#2f3948' }],
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#17263c' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#515c6d' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#17263c' }],
    },
  ];
  return (
    <SafeAreaView style={{ flex: 1, position: 'relative' }}>
      {runningIti && (
        <TopInfoCard
          tg={itiTg}
          tgNumber={tgNumber}
          setTgNumber={setTgNumber}
          setRunningIti={setRunningIti}
          setModalVisible={setModalVisible}
          setShowDirection={setShowDirection}
          resetRouteVariables={resetRouteVariables}
          destinationCoord={destinationCoord}
        />
      )}
      {runningIti && (
        <BottomInfoCard
          placeInfo={destinationInfo}
          tgNumber={tgNumber}
          nextRouteInfo={nextRouteInfo}
          togglePlayAudio={togglePlayAudio}
          tg={itiTg}
          showDirection={showDirection}
          currentlyPlaying={currentlyPlaying}
          expIdx={expIdx}
          directionIdx={directionIdx}
          dirDistance={dirDistance}
          destinationDistance={destinationDistance}
          resetRouteVariables={resetRouteVariables}
          setModalVisible={setModalVisible}
          setRunningIti={setRunningIti}
          setShowDirection={setShowDirection}
          setShowRating={setShowRating}
        />
      )}
      <View style={{ alignItems: 'center' }}>
        {!showDetailIti && (
          <GooglePlacesAutocomplete
            ref={placeRef}
            placeholder="Search for a location"
            minLength={2} // minimum length of text to search
            autoFocus={false}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            listViewDisplayed="auto" // true/false/undefined
            fetchDetails={true}
            GooglePlacesSearchQuery={{
              rankby: 'distance',
            }}
            renderDescription={row => row.description} // custom description render
            onPress={async (data, details = null) => {
              // 'details' is provided when fetchDetails = true
              //console.log(data, details);
              getTravelGuidesAndItineraries(details.place_id);
              placeRef.current.setAddressText('');
              setCoordinate({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              });
              setTemp({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              });
              setRegion({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              });
              setShowMarker(true);
              // console.log(
              //   'photo reference: ' + details.photos[0].photo_reference,
              // );
              setPhoto(details.photos[0].photo_reference);
              setDescription(data.structured_formatting.main_text);
            }}
            //getDefaultValue={() => ''}

            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: 'AIzaSyCsdtGfQpfZc7tbypPioacMv2y7eMoaW6g',
              language: 'en', // language of the results
              types: 'establishment', // default: 'geocode',
              location: `${region.latitude}, ${region.longitude}`,
              radius: 30000,
            }}
            textInputProps={{
              placeholderTextColor: 'white',
            }}
            styles={{
              textInputContainer: {
                width: '98%',
              },
              textInput: {
                backgroundColor: 'black',
                borderRadius: 10,
                color: 'white',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 10,
              },
              description: {
                fontFamily: 'Lexend-Regular',
                color: 'white',
              },
              predefinedPlacesDescription: {
                color: 'white',
              },
              container: {
                flex: 1,
                position: 'absolute',
                width: '98%',
                zIndex: 1,
                top: 10,
                alignItems: 'center',
                padding: 10,
              },
              listView: {
                width: '98%',
              },
              row: {
                backgroundColor: 'black',
              },
              separator: {
                backgroundColor: 'white',
              },
              powered: {
                opacity: 0,
              },
              poweredContainer: {
                opacity: 0,
              },
            }}
            currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
            currentLocationLabel="Current location"
            nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={
              {
                // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
              }
            }
            filterReverseGeocodingByTypes={[
              'locality',
              'administrative_area_level_3',
            ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
            keyboardShouldPersistTaps="handled"
            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
          //renderLeftButton={()  => <Image source={require('path/custom/left-icon')} />}
          />
        )}
      </View>
      <MapView
        ref={mapRef}
        style={styles.mapStyle}
        showsMyLocationButton={false}
        showsUserLocation
        provider="google"
        customMapStyle={isLight ? mapStyleLight : mapStyleDark}
        region={{
          latitude: temp.latitude,
          longitude: temp.longitude,
          latitudeDelta: coordinate.latitudeDelta,
          longitudeDelta: coordinate.longitudeDelta,
        }}
        onRegionChangeComplete={region => {
          setCoordinate(region);
          setTemp(region);
        }}
        onPoiClick={async e => {
          let placeIds = '';
          let res = await axios.get(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${e.nativeEvent.placeId}&key=AIzaSyCsdtGfQpfZc7tbypPioacMv2y7eMoaW6g`,
          );
          let data = res.data.result;
          console.log('Before place ids setting: ', placeIds);
          placeIds = res.data.result.place_id;
          setShowMarker(true);
          setPhoto(data.photos[0].photo_reference);
          setDescription(data.name);
          setRegion({
            latitude: data.geometry.location.lat,
            longitude: data.geometry.location.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          console.log('After setPlaceID: ', placeIds);
          setIsLoading(false);
          getTravelGuidesAndItineraries(placeIds);
        }}>
        {showMarker && (
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
            onPress={() => {
              setModalVisible(true);
            }}
          />
        )}
        {runningIti && (
          <Marker
            pinColor="cyan"
            coordinate={{
              latitude: tgMarkers[tgNumber].latitude,
              longitude: tgMarkers[tgNumber].longitude,
            }}
          />
        )}
        {showDetailIti &&
          !runningIti &&
          tgMarkers.map((marker, index) => {
            return (
              <Marker
                key={index}
                pinColor="black"
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
              />
            );
          })}
        {showDetailIti &&
          showDirection &&
          runningIds.map((id, index) => {
            return (
              <MapViewDirections
                key={id}
                apikey="AIzaSyBTu-eAg_Ou65Nzk3-2tvGjbg9rcC2_M3I"
                strokeWidth={3}
                strokeColor="hotpink"
                origin={
                  runningIti
                    ? userLocation
                    : index == 0
                      ? userLocation
                      : runningIds[index - 1]
                }
                destination={runningIti ? runningIds[tgNumber] : id}
                mode="WALKING"
                onReady={result => {
                  if (runningIti) {
                    if (!isOnTrack.current) {
                      setNextRouteInfo(result.legs[0].steps);
                      directionIdxRef.current = 0;
                      setDirectionIdx(0);
                      expIdx.current = 0;
                      isOnTrack.current = true;
                      expectedCoords.current = result.coordinates;
                      let distance = getDistance(
                        userLocationRef.current.latitude,
                        userLocationRef.current.longitude,
                        expectedCoords.current[0].latitude,
                        expectedCoords.current[0].longitude,
                      );
                      distance.current = Math.round(distance);
                    }
                    if (destinationCoord.current == null) {
                      destinationCoord.current =
                        result.legs[0].steps[
                          result.legs[0].steps.length - 1
                        ].end_location;
                      let distance = getDistance(
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
                }}
                resetOnChange={false}
              />
            );
          })}
      </MapView>
      <FloatingAction
        actions={actions}
        onPressItem={name => {
          if (name == 'Geolocation') {
            console.log(`selected button: ${name}`);
            console.log('curr: ' + getCurrentPosition());
          } else if (name == 'Brightness') {
            setLight(!isLight);
          }
        }}
        color="black"
        position="right"
        distanceToEdge={{ horizontal: 20, vertical: 40 }}
      />
      <Modal
        onBackdropPress={() => !showDetailIti && setModalVisible(false)}
        onBackButtonPress={() => !showDetailIti && setModalVisible(false)}
        isVisible={isModalVisible}
        swipeDirection={modalSwipeRule()}
        backdropOpacity={0}
        onSwipeComplete={e => {
          toggleModal(e);
        }}
        swipeThreshold={1}
        animationInTiming={900}
        animationOutTiming={500}
        style={styles.modal}
        useNativeDriver={true}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ translateY: modalAni }],
            },
          ]}>
          {showRating ? (
            <View style={styles.center}>
              <View style={styles.barIcon} />
              <View style={{ padding: 10, width: '100%' }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 20,
                    color: 'black',
                    letterSpacing: 5,
                    fontFamily: 'Lexend-Regular',
                  }}>
                  Please Rate Your Experience
                </Text>
                <RatingStars
                  setRatingValue={setRatingValue}
                  ratingValue={ratingValue}
                  submitting={submitting}
                  submitReview={submitReview}
                />
              </View>
            </View>
          ) : showDetailIti ? (
            <View style={styles.center}>
              <View style={styles.barIcon} />
              <TouchableOpacity
                style={styles.detailItiBackBtn}
                onPress={() => {
                  setShowDetailIti(false);
                  setShowTg(false);
                  setShowMarker(true);
                }}>
                <Text style={styles.backBtnArrow}>⟵</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.startItiButton}
                onPress={() => {
                  runItinerary();
                }}>
                <Text style={styles.startItiWord}>Start</Text>
              </TouchableOpacity>
              <Text
                style={{
                  color: 'black',
                  fontSize: 20,
                  marginTop: 5,
                  overflow: 'hidden',
                  width: 250,
                  fontFamily: 'Lexend-Regular',
                }}>
                {selectedIti.name}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  width: 250,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontWeight: '400',
                    color: 'black',
                    fontSize: 15,
                    fontFamily: 'Lexend-ExtraLight',
                  }}>
                  {selectedIti.username} |
                </Text>
                <Text
                  style={{
                    fontWeight: '400',
                    color: 'black',
                    fontSize: 15,
                    marginRight: 'auto',
                    marginLeft: 'auto',
                  }}>
                  {selectedIti.rating
                    ? ratingMap[Math.round(selectedIti.rating)]
                    : 'no rating'}
                </Text>
              </View>
              <Text
                style={{
                  fontWeight: '400',
                  color: 'black',
                  fontSize: 15,
                  marginTop: 5,
                  borderTopWidth: 1,
                  borderTopColor: 'white',
                  width: '100%',
                  padding: 10,
                  textAlign: 'center',
                  fontFamily: 'Lexend-ExtraLight',
                }}>
                {selectedIti.description}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 10,
                  fontFamily: 'Lexend-ExtraLight',
                }}>
                <View style={{ width: 150 }}></View>
              </View>
            </View>
          ) : (
            <View style={styles.center}>
              <View style={styles.barIcon} />
              <Text
                style={{
                  color: 'black',
                  fontSize: 20,
                  marginTop: 5,
                  fontFamily: 'Lexend-Light',
                }}>
                {description}
              </Text>
              <Image
                source={{ uri: url }}
                style={{
                  height: 100,
                  width: 370,
                  marginTop: 10,
                  borderRadius: 10,
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  display: 'flex',
                  marginTop: 10,
                  padding: 10,
                  width: '100%',
                  justifyContent: 'space-around',
                }}>
                <View style={{ width: 150 }}>
                  <Pressable
                    style={{
                      backgroundColor: showTg ? 'black' : 'whitesmoke',
                      padding: 10,
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => setShowTg(true)}>
                    <Text
                      style={{
                        color: showTg ? 'white' : 'black',
                        fontSize: 15,
                        letterSpacing: 1,
                        fontFamily: 'Lexend-Light',
                      }}>
                      Travel Guides
                    </Text>
                  </Pressable>
                </View>
                <View
                  style={{
                    borderWidth: 0.5,
                    height: '100%',
                    borderColor: 'white',
                  }}
                />
                <View style={{ width: 150 }}>
                  <Pressable
                    style={{
                      backgroundColor: showTg ? 'whitesmoke' : 'black',
                      padding: 10,
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => setShowTg(false)}>
                    <Text
                      style={{
                        color: showTg ? 'black' : 'white',
                        fontSize: 15,
                        letterSpacing: 1,
                        fontFamily: 'Lexend-Light',
                      }}>
                      Itineraries
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
          {/* <StatusBar backgroundColor="#000" /> */}
          {!showRating && (
            <View style={{ maxHeight: 500, padding: 10 }}>
              <FlatList
                data={
                  showDetailIti ? itiTg : showTg ? travelGuides : itineraries
                }
                keyExtractor={item => item._id}
                renderItem={renderItem}
                ListFooterComponent={renderLoader}
                onEndReached={loadMoreItem}
                onEndReachedThreshold={2}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ flexGrow: 1 }}
              />
            </View>
          )}
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

export default Map;
