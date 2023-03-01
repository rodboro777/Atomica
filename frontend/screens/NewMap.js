import React, {useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {StyleSheet, SafeAreaView, View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView from 'react-native-maps';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import {Dimensions} from 'react-native';

export default function NewMap() {
    Geolocation.requestAuthorization();
    const [region, setRegion] = useState({
        latitude: 53.9854,
        longitude: -6.3945,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    function handleRegionChange() {

    }

    const PAGE_TYPE = {
        GUIDES: 'guides',
        ITINERARIES: 'itineraries'
    };
    const [currentPage, setCurrentPage] = useState(PAGE_TYPE.GUIDES);
    const sheetRef = React.useRef(null);
    const windowHeight = Dimensions.get('window').height;

    const renderBackdrop = () => (
        <Animated.View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
      );

    const renderContent = () => (
        <View
          style={{
            backgroundColor: 'white',
            padding: 10,
            height: windowHeight - 150,
            zIndex: 1
          }}
        >
          <View style={styles.stripIcon}>

          </View>
          <Text style={{
            fontFamily: 'Lexend-SemiBold',
            fontSize: 16,
            color: 'black',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 15
          }}>80 travel guides</Text>
        </View>
    );
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topView}>
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
                        Search for travel guides...
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
                customMapStyle={mapStyleDark}
                showsUserLocation
                mapPadding={{
                    bottom: 80,
                }}
                provider="google"
                region={region}
                onRegionChange={handleRegionChange}
                style={styles.map}
            />
            
            <BottomSheet
                style={{zIndex: 1}}
                ref={sheetRef}
                snapPoints={[windowHeight - 150, 80]}
                borderRadius={30}
                initialSnap={1}
                renderContent={renderContent}
                backdropComponent={renderBackdrop}
                overdragResistanceFactor={false}
            />
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

const mapStyleDark = [
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}],
    },
];