import React, {useState} from 'react';
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
  TouchableOpacity,
  Animated,
} from 'react-native';
import playIcon from '../assets/play_1.png';
import pauseIcon from '../assets/pause_1.png';
export default function BottomInfoCard(props) {
  const {
    placeInfo,
    tgNumber,
    nextRouteInfo,
    togglePlayAudio,
    tg,
    showDirection,
    currentlyPlaying,
    directionIdx,
    dirDistance,
    destinationDistance,
  } = props;
  const styles = StyleSheet.create({
    bottomCardHolder: {
      position: 'absolute',
      zIndex: 2,
      width: Dimensions.get('window').width,
      height: 180,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bottom: 0,
      padding: 10,
    },
    bottomCardContentHolder: {
      position: 'relative',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      backgroundColor: '#AA96DA',
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
      padding: 10,
      width: '90%',
      height: '100%',
      borderRadius: 15,
      flexDirection: 'row',
    },
    bottomCardImageHolder: {
      flex: 1.2,
      width: '30%',
      height: '100%',
      borderRadius: 10,
    },
    bottomCardInfoHolder: {
      flex: 2,
      paddingLeft: 10,
    },
    bottomCardPlayerHolder: {
      marginTop: 10,
    },
  });
  return (
    <View style={styles.bottomCardHolder}>
      <View style={styles.bottomCardContentHolder}>
        <View style={styles.bottomCardImageHolder}>
          <Image
            source={{uri: placeInfo[tgNumber].imageUrl}}
            style={{flex: 1, borderRadius: 10}}
          />
        </View>
        <View style={styles.bottomCardInfoHolder}>
          <Text style={{color: 'white', fontSize: 15}}>
            {nextRouteInfo && nextRouteInfo[directionIdx].maneuver
              ? nextRouteInfo[directionIdx].maneuver
              : 'Go Straight'}
          </Text>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 18,
              marginTop: 5,
            }}>
            {placeInfo[tgNumber].name}
          </Text>
          <View style={styles.bottomCardPlayerHolder}>
            {showDirection ? (
              <View style={{flexDirection: 'row', marginTop: 20}}>
                <Text style={{color: 'white', fontSize: 15, fontWeight: '400'}}>
                  {destinationDistance && `${destinationDistance}m left`}
                </Text>
              </View>
            ) : (
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{
                    flex: 0.3,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    togglePlayAudio(tg[tgNumber]);
                  }}>
                  <Image
                    source={currentlyPlaying[1] ? pauseIcon : playIcon}
                    style={{width: 30, height: 30}}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    flex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlignVertical: 'center',
                    color: 'white',
                  }}>
                  {currentlyPlaying[1] ? 'Pause Audio' : 'Play Audio'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
