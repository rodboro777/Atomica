import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import nextIcon from '../assets/next.png';
import cancelIcon from '../assets/close.png';
import SoundPlayer from 'react-native-sound-player';

export default function TopInfoCard(props) {
  const {
    tg,
    tgNumber,
    setTgNumber,
    setRunningIti,
    setShowDirection,
    resetRouteVariables,
    destinationCoord,
    currentSpecialScreen,
    setCurrentBottomSheetType,
    deactivateTravelGuideNav,
    setAudioTime
  } = props;

  const styles = StyleSheet.create({
    topCardHolder: {
      zIndex: 2,
      width: Dimensions.get('window').width,
      height: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop:10,
    },
    topCardContentHolder: {
      position: 'relative',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      backgroundColor: 'black',
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
      padding: 10,
      width: '90%',
      height: '100%',
      borderRadius: 15,
      marginTop: 10,
    },
    topCardTitleView: {
      position: 'absolute',
      padding: 10,
      top: 3,
    },
    topCardTgNumber: {
      position: 'absolute',
      padding: 10,
      bottom: 5,
    },
    topCardTextStyle: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 18,
    },
    topCardControllerView: {
      position: 'absolute',
      flexDirection: 'row',
      right: 10,
      top: '50%',
      transform: [{translateY: -10}],
      padding: 10,
    },
  });
  return (
    <View style={styles.topCardHolder}>
      <View style={styles.topCardContentHolder}>
        <View style={styles.topCardTitleView}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'Lexend-Regular',
              fontSize: 18,
            }}>
            {tg.length > 0 && tg[tgNumber].name}
          </Text>
        </View>
        <View style={styles.topCardTgNumber}>
          <Text
            style={{
              color: 'white',
              fontSize: 17,
              letterSpacing: 3,
              fontFamily: 'Lexend-Light',
            }}>
            {tg.length > 1 && `${tgNumber + 1}/${tg.length}`}
          </Text>
        </View>
        <View style={styles.topCardControllerView}>
          {tgNumber > 0 && (
            <TouchableOpacity
              style={{marginRight: 10}}
              onPress={() => {
                setTgNumber(tgNumber - 1);
                setShowDirection(true);
                destinationCoord.current = null;
                setAudioTime(0);
                SoundPlayer.pause();
              }}>
              <Image
                source={nextIcon}
                style={{width: 25, height: 25, transform: [{rotate: '180deg'}]}}
              />
            </TouchableOpacity>
          )}
          {tgNumber < tg.length - 1 && (
            <TouchableOpacity
              style={{marginRight: 20}}
              onPress={() => {
                setTgNumber(tgNumber + 1);
                setShowDirection(true);
                destinationCoord.current = null;
                setAudioTime(0);
                SoundPlayer.pause();
              }}>
              <Image source={nextIcon} style={{width: 25, height: 25}} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => {
              SoundPlayer.pause();
              setAudioTime(0);
              setRunningIti(false);
              setShowDirection(currentSpecialScreen == "travelGuideNavigation" ? false : true);
              if (currentSpecialScreen == "travelGuideNavigation") {
                deactivateTravelGuideNav();
              }
              resetRouteVariables();
            }}>
            <Image source={cancelIcon} style={{width: 25, height: 25}} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
