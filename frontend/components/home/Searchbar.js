import React, {useRef} from 'react';
import {TouchableOpacity} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Searchbar({
    region,
    mapKey,
    setSelectedLocation,
    setCurrentBottomSheetType,
    getImageUrlFromPhotoReference,
    mapRef
}) {
    const placeRef = useRef(null);

    const BOTTOM_SHEET_TYPE = {
        CONTENTS_WITHIN_AREA: 'contentsWithinArea',
        CONTENTS_FOR_LOCATION: 'contentsForLocation'
    };
    return (
    <GooglePlacesAutocomplete
        renderLeftButton={() => (
          <Icon name="magnify" size={24} color="#000" style={{
            marginLeft: 10,
            marginTop: 'auto',
            marginBottom: 'auto'
          }} />
        )}
        renderRightButton={() => (
          <TouchableOpacity activeOpacity={0.5} onPress={() => {
            placeRef.current.setAddressText('');
          }}>
            <Icon 
              name="close"
              size={24}
              color='black'
              style={{
                marginTop: 'auto',
                marginBottom: 'auto',
                marginRight: 10
              }}
            />
          </TouchableOpacity>
        )}
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
          placeRef.current.setAddressText('');
          let regionCandidate = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          }

          mapRef.current.animateToRegion(regionCandidate);
          // setRegion(regionCandidate);

          let imageUrl = 'https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png';
          if (details.photos && details.photos.length > 0) {
            imageUrl = getImageUrlFromPhotoReference(details.photos[0].photo_reference);
          }

          // Set BottomSheetType to for locations and set selectedLocation.
          setSelectedLocation({
            placeId: details.place_id,
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            imageUrl: imageUrl,
            name: data.structured_formatting.main_text
          });
          setCurrentBottomSheetType(BOTTOM_SHEET_TYPE.CONTENTS_FOR_LOCATION);
        }}
        query={{
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: mapKey,
          language: 'en', // language of the results
          types: 'establishment', // default: 'geocode',
          location: `${region.latitude}, ${region.longitude}`,
          radius: 30000,
        }}
        textInputProps={{
          placeholderTextColor: 'grey',
          fontFamily: 'Lexend-Regular',
          color: 'black'
        }}
        styles={{
          textInputContainer: {
            width: '100%',
            borderRadius: 50,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 10,
            backgroundColor: 'white',
            // borderStyle: 'solid',
            // borderWidth: 1,
          },
          textInput: {
            backgroundColor: 'transparent',
            // borderStyle: 'solid',
            // borderWidth: 1,
            marginBottom: 0,
            color: 'black'
          },
          description: {
            fontFamily: 'Lexend-Regular',
            color: 'black',
          },
          predefinedPlacesDescription: {
            color: 'black',
          },
          container: {
            width: '100%',
            height: '100%',
            zIndex: 1,
            alignItems: 'center',
            padding: 0,
            zIndex: 9999
          },
          row: {
            backgroundColor: 'white',
            
          },
        }}
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
    )
}