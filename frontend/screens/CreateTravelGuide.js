import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Plus from '../assets/plus.png';
import Upload from '../assets/upload.png';
import Eye from '../assets/eye.png';
import CEye from '../assets/ceye.png';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Done from '../assets/done.png';
import DocumentPicker from 'react-native-document-picker';


export default function CreateTravelGuide({navigation, route}) {
  const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};
    const [location, setLocation] = React.useState({
      placeId: '',
      name: '',
      description: '',
      audio: null,
      locationName: '',
    });
    const [eicon, setEicon] = React.useState(Eye);
    const [ region, setRegion ] = React.useState({
      latitude: 53.350140,
      longitude: -6.266155,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    });

    const createTravelGuide = () => {
      console.log(location);
      const formData = new FormData();
      formData.append('placeId', location.placeId);
      formData.append('name', location.name);
      formData.append('description', location.description);
      formData.append('audio', {
        uri: location.audio.uri,
        type: location.audio.type,
        name: location.audio.name,
      });
      console.log(formData);

      fetch('http://192.168.0.94:8000/travelGuide', {
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
            console.log("success");
            navigation.goBack();
          } else if (resBody.statusCode == 403) {
            // TODO user entered the wrong credentials. add a UI for this.
            console.log("failed");
          }
        })
        .catch(err => {
          console.log(err);
        });
    };

  return (
    <View style={styles.container}>
      <TextInput 
        placeholder='Type Travel title here..'
        placeholderTextColor = "#9a73ef" 
        style={styles.input}
        onChangeText={(e) => {
          setLocation({
            ...location,
            name: e,
          })
        }}
        value={location.name}
        />
    {/* <TouchableOpacity
          style={styles.buttonItiStyle}
          activeOpacity={0.5}
          onPress={getLocation()}
          >
          <Image
            source={Plus}
            style={styles.buttonImageIconStyle}
          />
          <View style={styles.buttonIconSeparatorStyle} />
          <Text style={styles.buttonTextStyle}>Add Location</Text>
    </TouchableOpacity> */}
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
        setRegion({
          latitude: details.geometry.location.lat,
          longitude: details.geometry.location.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        });

        setLocation({
          ...location,
          locationName: data.structured_formatting.main_text,
          placeId: data.place_id,
        });
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
          position: "relative",
          width: "98%", 
          zIndex: 1, 
          marginTop: 5, 
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
    <TextInput 
        placeholder='Location'
        placeholderTextColor = "#9a73ef" 
        style={styles.input}
        value={location.locationName}
        editable={false}
        />
     <TextInput 
        placeholder='Description...'
        placeholderTextColor = "#9a73ef" 
        style={styles.description}
        onChangeText={(e) => {
          setLocation({
            ...location,
            description: e
          })
        }}
        value={location.description}
        />
      <TouchableOpacity
          style={styles.buttonItiStyle}
          activeOpacity={0.5}
          onPress={async () => {
            try {
              const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
              });
              console.log(result[0].uri);
              setLocation({
                ...location,
                audio: result[0],
              })
            } catch (error) {
              console.log(error);
            }
          }}
          //onPress={getLocation()}
          >
          <Image
            source={Upload}
            style={styles.buttonImageIconStyle}
          />
          <View style={styles.buttonIconSeparatorStyle} />
          <Text style={styles.buttonTextStyle}>Upload Audio</Text>
      </TouchableOpacity>
      <TouchableOpacity
          style={styles.buttonItiStyle}
          activeOpacity={0.5}
          onPress={() => setEicon(CEye)}
          >
          <Image
            source={eicon}
            style={styles.buttonImageIconStyle}
          />
          <View style={styles.buttonIconSeparatorStyle} />
          <Text style={styles.buttonTextStyle}>Public</Text>
      </TouchableOpacity>
      <View style={{justifyContent: 'center', alignContent: 'center', alignItems:'center'}}>
       <TouchableOpacity
          style={styles.buttonDONEStyle}
          activeOpacity={0.5}
          onPress={() => {
            createTravelGuide();
          }}
          >
          <Image
            source={Done}
            style={styles.buttonImageIconStyle}
          />
      </TouchableOpacity> 
      </View>
      
    </View>
  )
}

const styles = StyleSheet.create({ 
  container: {
      flex: 1,
      margin: 0,
      marginTop: 0,
      padding: 30,
      backgroundColor: '#C5FAD5',
    },
    input: {
      margin: 5,
      height: 50,
      borderColor: '#7a42f4',
      borderWidth: 1,
      borderRadius: 10,
      fontSize: 15,
      fontWeight: 'bold',
   },
   description: {
    margin: 5,
      height: 100,
      borderColor: '#7a42f4',
      borderWidth: 1,
      borderRadius: 10,
      fontSize: 15,
      fontWeight: 'bold',
   },
   buttonItiStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#485a96',
      borderWidth: 0.5,
      borderColor: '#fff',
      height: 40,
      borderRadius: 5,
      margin: 5,
      marginTop: 10
    },
    buttonImageIconStyle: {
      padding: 10,
      margin: 5,
      height: 25,
      width: 25,
      resizeMode: 'stretch',
      tintColor: 'white'
    },
    buttonTextStyle: {
      color: '#fff',
      marginBottom: 4,
      marginLeft: 10,
      fontWeight: 'bold'
    },
    buttonIconSeparatorStyle: {
      backgroundColor: '#fff',
      width: 1,
      height: 40,
    },
    buttonHeaderStyle: {
      color: '#000',
      marginTop: 10,
      marginLeft: 10,
      fontWeight: 'bold',
      fontSize: 22,
      fontFamily: 'monospace'
    },
    buttonDONEStyle: {
      alignItems: 'center',
      backgroundColor: '#485a96',
      borderWidth: 0.5,
      borderColor: '#fff',
      height: 40,
      borderRadius: 5,
      margin: 5,
      marginTop: 50,
      width: 100,
      justifyContent: 'center'
    }
});