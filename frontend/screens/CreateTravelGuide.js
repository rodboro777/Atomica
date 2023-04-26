import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DocumentPicker from 'react-native-document-picker';
import upArrow from '../assets/uparrow.png';
import camera from '../assets/camera.png';
import headphones from '../assets/headphones.png';
import ip from '../ip';
export default function CreateTravelGuide({ navigation, route }) {

  const [defaultPhotoUrl, setDefaultPhotoUrl] = useState('');
  const key = 'AIzaSyB1t38ZZXBXyQJb7e5bZ9S46MW8lhp5eks';
  const [location, setLocation] = React.useState({
    placeId: '',
    name: '',
    description: '',
    audio: null,
    locationName: '',
    uploadedPhoto: null,
  });
  const placeRef = useRef();
  const [region, setRegion] = React.useState({
    latitude: 53.35014,
    longitude: -6.266155,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const createTravelGuide = async () => {

    const formData = new FormData();

    //write a console.log to see what the location looks like before you send it to the backend

    formData.append('placeId', location.placeId);
    formData.append('name', location.name);
    formData.append('public', true);
    formData.append('locationName', location.locationName);
    formData.append('description', location.description);
    formData.append('audio', {
      uri: location.audio.uri,
      type: location.audio.type,
      name: location.audio.name,
    });

    if (location.uploadedPhoto !== null && typeof location.uploadedPhoto !== 'undefined') {
      formData.append('image', location.uploadedPhoto);
    } else {
      formData.append('imageUrl', defaultPhotoUrl);
    }

    formData.append('coordinates', JSON.stringify({
      lat: region.latitude,
      lng: region.longitude
    }));

    console.log('ALLLLLLL ' + formData.getAll('description'));
    console.log('ALLLLLLL ' + formData.getAll('name'));

    await fetch(`http://${ip.ip}:8000/travelGuide`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(res => res.json())
      .then(resBody => {
        console.log(resBody);
        if (resBody.statusCode == 200) {
          console.log('success');
          navigation.navigate('User', { origin: "CreateTravelGuide" });
        } else if (resBody.statusCode == 403) {
          // TODO user entered the wrong credentials. add a UI for this.
          console.log('failed');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (

    <View style={styles.container}>
      <View style={styles.pageNameHolder}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('User')}>
          <Image
            source={upArrow}
            style={{ tintColor: 'black', width: '100%', height: '100%' }}
          />
        </TouchableOpacity>
        <Text
          style={styles.topHeader}>
          {'Create Travel Guide'}
        </Text>
      </View>
      <Text
        style={styles.headers}>
        {'Whereabouts ?'}
      </Text>

      {/*=============  GOOGLE AUTOCOMPLETE ======================== */}
      <View
        style={styles.autocompleteTopContainer}>
        <Image
          source={require('../assets/search.png')}
          style={styles.mapicon}
        />
        <View
          style={styles.autocompleteSearchBar}>
          <GooglePlacesAutocomplete

            ref={placeRef}
            placeholder="Search For Location"
            minLength={2} // minimum length of text to search
            autoFocus={false}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            listViewDisplayed="auto" // true/false/undefined
            fetchDetails={true}
            currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
            currentLocationLabel="Current location"
            clearTextOnFocus={false}
            GooglePlacesSearchQuery={{
              rankby: 'distance',
              inputtype: 'textquery'
            }}
            renderDescription={row => row.description || row.formatted_address || row.name} // custom description render
            onPress={(data, details = null) => {

              // 'details' is provided when fetchDetails = true

              let locationName = "";
              if (data.structured_formatting && data.structured_formatting.main_text) {
                locationName = data.structured_formatting.main_text;
              } else {
                locationName = data.name;
              }

              console.log('THIS IS LAT' + details.geometry.location.lat)
              console.log('THIS IS LONG' + details.geometry.location.lng)

              placeRef.current.setAddressText('');
              setRegion({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              });

              setLocation({

                ...location,
                locationName: locationName,
                placeId: data.place_id,
              });

              // get the photoref.
              const photoRef = details?.photos?.[0]?.photo_reference;
              const url = photoRef
                ? `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoRef}&sensor=false&maxheight=500&maxwidth=500&key=${key}`
                : 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty-300x240.jpg';

              console.log('THIS IS URL OF PHOT AFTER ' + url);
              setDefaultPhotoUrl(url);

            }}
            getDefaultValue={() => ''}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: key,
              language: 'en', // language of the results
              types: 'establishment', // default: 'geocode',
              location: `${region.latitude}, ${region.longitude}`,
              radius: 30000,
            }}
            textInputProps={{
              placeholderTextColor: 'black',
            }}
            styles={styles.autocompleteDesign}
            nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch

            filterReverseGeocodingByTypes={[
              'locality',
              'administrative_area_level_3',
            ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
            keyboardShouldPersistTaps="handled"
            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
          />
        </View>
        {location.locationName && (
          <View style={styles.searchResult}>
            <Image
              source={require('../assets/location.png')}
              style={styles.mapicon}
            />
            <TextInput
              style={styles.title}
              value={location.locationName}
              editable={false}
            />
          </View>
        )}

      </View>
      {/*============= END GOOGLE AUTOCOMPLETE ======================== */}

      {/*============= TITLE and DESCRIPTION ======================== */}
      <Text
        style={styles.headers}>
        {'Name it'}
      </Text>
      <TextInput
        placeholder="Title"
        placeholderTextColor="black"
        style={styles.input}
        value={location.name}
        onChangeText={e =>
          setLocation({
            ...location,
            name: e
          })
        }

      />

      <TextInput

        placeholder="Description"
        multiline={true}
        placeholderTextColor="black"
        value={location.description}
        style={styles.description}
        onChangeText={text => setLocation({ ...location, description: text })}

      />
      {/*============= END TITLE and DESCRIPTION ======================== */}


      {/*============= CONTENT =============================================*/}
      <View>
        <Text
          style={styles.headers}>
          {'Add Content'}
        </Text>
        <View style={styles.contentContainer}>
          <TouchableOpacity
            style={styles.buttonItiStyle}
            activeOpacity={0.5}
            onPress={async () => {
              try {
                const result = await DocumentPicker.pick({
                  type: [DocumentPicker.types.allFiles],
                });

                console.log("Document Picker + " + result[0].uri + "\n");
                setLocation({
                  ...location,
                  audio: result[0],
                });
              } catch (error) {
                console.log(error);
              }
            }}
          //onPress={getLocation()}
          >
            <Image source={headphones} style={styles.buttonImageIconStyle} />
            <Text style={styles.buttonTextStyle}>Upload Audio</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonItiStyle}
            activeOpacity={0.5}
            onPress={async () => {
              try {
                const result = await DocumentPicker.pick({
                  type: [DocumentPicker.types.allFiles],
                });
                console.log("Document Picker + " + result[0] + "\n");
                setLocation({
                  ...location,
                  uploadedPhoto: result[0],
                });
              } catch (error) {
                console.log(error);
              }
            }}>
            <Image source={camera} style={styles.buttonImageIconStyle} />
            <Text style={styles.buttonTextStyle}>Upload Image</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/*============= END CONTENT =============================================*/}

      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 'auto',
          marginBottom: 30,
          padding: 10,
        }}>
        <TouchableOpacity
          style={styles.buttonDONEStyle}
          activeOpacity={0.5}
          onPress={() => {

            createTravelGuide();
          }}>
          <Text
            style={{
              ...styles.buttonTextStyle,
              fontSize: 23,
              fontFamily: 'Cereal_thicc',
              color: 'white',
            }}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    marginTop: 0,
    backgroundColor: 'white',
  },
  pageNameHolder: {
    width: '100%',
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'white',
    height: 60,
    borderBottomColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 6,
  },
  input: {
    fontSize: 17,
    margin: 23,
    borderRadius: 10,
    marginTop: 20,
    width: '90%',
    backgroundColor: 'white',
    color: 'black',
    fontFamily: 'Cereal_Medium',
    borderBottomWidth: 2,
    borderBottomColor: 'grey',
  },
  description: {
    height: 100,
    width: '85%',
    marginTop: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderWidth: 1,
    borderRadius: 15,
    fontSize: 15,
    textAlignVertical: 'top',
    padding: 10,
    fontFamily: 'Cereal_Medium',
    color: 'grey',
    border: '1px solid grey'
  },
  buttonItiStyle: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: 30,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  mapicon: {
    marginRight: 10,
    height: 25,
    width: 25,
    marginTop: 20,
  },
  buttonImageIconStyle: {
    height: 25,
    width: 25,
    resizeMode: 'stretch',
    tintColor: 'black',
  },
  buttonTextStyle: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'Cereal_Medium',
  },
  buttonIconSeparatorStyle: {
    backgroundColor: '#fff',
    width: 1,
    height: 40,
  },

  buttonDONEStyle: {
    backgroundColor: '#F7572D',
    position: 'absolute',
    borderColor: 'white',
    height: 55,
    borderRadius: 20,
    width: 150,
    display: 'flex',
    fontFamily: 'Cereal_Medium',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  headers:
  {
    fontFamily: 'Cereal_bold',
    marginTop: 30,
    marginLeft: 20,
    fontSize: 20,
    letterSpacing: 1,
    color: 'black',
  },

  topHeader:
  {
    fontFamily: 'Cereal_bold',
    fontSize: 20,
    letterSpacing: 1,
    color: 'black',
  },
  backButton:
  {
    position: 'absolute',
    left: 20,
    transform: [{ rotate: '-90deg' }],
    height: 30,
    width: 30,

  },
  autocompleteTopContainer:
  {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    border: '3px solid black',
    borderColor: 'black',
    fontFamily: "Cereal_Medium",
    flexDirection: 'row' // add flexDirection: 'row'
  },
  autocompleteSearchBar:
  {
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    border: '3px solid black',
    borderColor: 'black',
    fontFamily: "Cereal_Medium",
    flexDirection: 'row' // add flexDirection: 'row'
  },
  autocompleteDesign:
  {
    description: {
      color: 'black',
      fontFamily: 'Cereal_Medium',
      textAlign: 'center',
    },
    textInputContainer: {
      color: 'black',
      fontFamily: 'Cereal_Medium',
      borderBottomColor: 'white',
    },
    textInput: {
      backgroundColor: 'white',
      fontFamily: 'Cereal_Medium',
      color: 'black',
      textAlign: 'left',
      borderBottomWidth: 2,
      borderBottomColor: 'grey',
    },
    predefinedPlacesDescription: {
      color: 'black',
    },
    listView: {
      backgroundColor: 'white',
    },
    row: {
      backgroundColor: 'white',
    },
    powered: {
      opacity: 0,
    },
    poweredContainer: {
      opacity: 0,

    },
  },
  title:
  {
    fontSize: 17,
    marginTop: 20,
    paddingBottom: 15,
    backgroundColor: 'white',
    color: 'black',
    fontFamily: 'Cereal_Medium',
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  searchResult:
  {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contentContainer:
  {
    flexDirection: 'row',
    flexWrap: 'wrap',
  }

});
