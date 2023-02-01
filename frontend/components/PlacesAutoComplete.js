import React, {useState, useEffect} from "react";
import {View, Image, Text, FlatList, ActivityIndicator, StatusBar, Pressable, StyleSheet} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import PlayIcon from "../assets/play.png";
import axios from "axios";

const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};


const PlacesAutoComplete = ({navigation}) => {

  const [ pin, setPin ] = React.useState({
		latitude: 53.40140,
    longitude: -6.226155,
	})
	const [ region, setRegion ] = React.useState({
		latitude: 53.350140,
    longitude: -6.266155,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421
	})

  const [isPlaying, setIsPlaying] = useState(false);

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('dublin');

  const getUsers = () => {
    setIsLoading(true);
    axios.get(`https://randomuser.me/api/?page=${currentPage}&results=10`)
      .then(res => {
        //setUsers(res.data.results);
        setUsers([...users, ...res.data.results]);
        setIsLoading(false);
      });
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemWrapperStyle}>
        <Image style={styles.itemImageStyle} source={{ uri: item.picture.large }} />
        <View style={styles.contentWrapperStyle}>
          <Text style={styles.txtNameStyle}>{`${item.name.title} ${item.name.first} ${item.name.last}`}</Text>
          <Text style={styles.txtEmailStyle}>{item.email}</Text>
        </View>
      </View>
    );
  };

  const renderLoader = () => {
    return (
      isLoading ?
        <View style={styles.loaderStyle}>
          <ActivityIndicator size="large" color="#aaa" />
        </View> : null
    );
  };

  const loadMoreItem = () => {
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    getUsers();
  }, [currentPage]);




  return (
    <View style={{
      flex: 1,
      backgroundColor: '#C5FAD5'
    }}>
    <GooglePlacesAutocomplete
      placeholder='Search'
      minLength={2} // minimum length of text to search
      autoFocus={false}
      returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
      listViewDisplayed='auto'    // true/false/undefined
      fetchDetails={true}
      GooglePlacesSearchQuery={{
        rankby: "distance"
      }}
      renderDescription={row => row.description} // custom description render
      onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
        console.log(data, details);
        setRegion({
          latitude: details.geometry.location.lat,
          longitude: details.geometry.location.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        });
        setTitle(details.name);
        navigation.navigate('CTravelGuide', {paramKey: title})
      }}
      
      getDefaultValue={() => ''}
      
      query={{
        // available options: https://developers.google.com/places/web-service/autocomplete
        key: 'AIzaSyCsdtGfQpfZc7tbypPioacMv2y7eMoaW6g',
        language: 'en', // language of the results
        types: "establishment", // default: 'geocode',
        location: `${region.latitude}, ${region.longitude}`,
        radius: 30000
      }}
      
      styles={{
        textInputContainer: {
          width: '98%'
        },
        description: {
          fontWeight: 'bold'
        },
        predefinedPlacesDescription: {
          color: '#1faadb'
        },
        container: { 
          flex: 0, 
          position: "absolute",
          width: "98%", 
          zIndex: 1, 
          marginTop: 15, 
          alignItems: "center",
          justifyContent: "center",
        },
				listView: { 
          backgroundColor: "white" 
        }
      }}
      
      currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
      currentLocationLabel="Current location"
      nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
      GoogleReverseGeocodingQuery={{
        // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
      }}
      filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
      predefinedPlaces={[homePlace, workPlace]}
      keyboardShouldPersistTaps="handled"
      debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
      //renderLeftButton={()  => <Image source={require('path/custom/left-icon')} />}
      renderRightButton={() => <Text></Text>}
    />
    <Pressable >
          <View style={[styles.widgetContainer, {}]}>
            <View style={{flexDirection: 'row'}}>
              <Image
                resizeMode="cover"
                source={{uri: 'https://www.bensound.com/bensound-img/happyrock.jpg'}}
                style={styles.widgetImageStyle}
              />
              <View>
                <Text style={styles.widgetMusicTitle}>
                Punky
                </Text>
                <Text style={styles.widgetArtisteTitle}>
                  Benjamin Tissot
                </Text>
              </View>
            </View>
            <Pressable onPress={() => playOrPause()}>
              <Image
                source={isPlaying ? PauseIcon : PlayIcon}
                style={{height: 30, tintColor: '#000', width: 30, marginRight: 10}}
              />
            </Pressable>
          </View>
        </Pressable>

      
  
    </View>
  );
}

export default PlacesAutoComplete;

const styles = StyleSheet.create({ 
  widgetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    height: 60,
    width: '100%',
    backgroundColor: '#fff',
    marginTop: 650,
    borderWidth: 2,
    borderColor: 'black'
  },
  widgetMusicTitle: {
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
    marginTop: 12,
    marginHorizontal: 10,
    marginBottom: 1,
  },
  widgetArtisteTitle: {
    fontSize: 14,
    color: '#000',
    opacity: 0.8,
    marginHorizontal: 10,
    marginBottom: 12,
    marginTop: 1,
  },
  widgetImageStyle: {
    width: 55,
    height: 55,
    marginTop: 7,
    marginLeft: 5,
    borderRadius: 10
  },
  itemWrapperStyle: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  itemImageStyle: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  contentWrapperStyle: {
    justifyContent: "space-around",
  },
  txtNameStyle: {
    fontSize: 16,
  },
  txtEmailStyle: {
    color: "#777",
  },
  loaderStyle: {
    marginVertical: 16,
    alignItems: "center",
  },
})