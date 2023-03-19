import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import backbutton from '../assets/backward-seek.png';
import forwardbutton from '../assets/forward-seek.png';
import SoundPlayer from 'react-native-sound-player';

export default function SeekBar(props) {
  const {currentAudioTime, setAudioTime, itiTg, tgNumber} = props;

  const currentTimeMinutes = Math.floor((currentAudioTime % 3600) / 60);
  const currentTimeSeconds = ('0' + Math.floor((currentAudioTime % 3600) % 60)).slice(-2);
  const minutesDuration = itiTg.length > 0 &&
    Math.floor((itiTg[tgNumber].audioLength % 3600) / 60);
  const secondsDuration = itiTg.length > 0 &&
    ('0' + Math.floor((itiTg[tgNumber].audioLength % 3600) % 60)).slice(-2);

  const seekForward = time => {
    if (currentAudioTime != 0) {
      if (
        currentAudioTime + time <
        (itiTg.length > 0 && itiTg[tgNumber].audioLength)
      )
        setAudioTime(currentAudioTime + time);

      SoundPlayer.seek(currentAudioTime + time);
    } else {
      console.log('No Travel Guide present');
    }
  };

  const seekBackward = time => {
    if (currentAudioTime != 0) {
      SoundPlayer.seek(currentAudioTime - time);
      if (currentAudioTime - time < 0) 
        setAudioTime(0);
      else 
        setAudioTime(currentAudioTime - time);
    } 
    else
      console.log('No Travel Guide present');
  };

  //Calcualte where to jump in the audio when the user uses the SeekBar
  const handleSeekBarChange = value => {
    seekToTime = value * (itiTg.length > 0 && itiTg[tgNumber].audioLength);
    setAudioTime(seekToTime)
    SoundPlayer.seek(seekToTime);
  };

  //TODO Is there a way to interval this check? happens too frequently imo
  // Calculate the audio time to move the SeekBar accordingly
  calculateSeekBar = () => {
      return (currentAudioTime / (itiTg.length > 0 && itiTg[tgNumber].audioLength))
  };

  return (
    <View style={styles.sliderCardHolder}>
      {/* Everything inside this view is inside the black box
              Anything place outside of it will go outside the box */}
      <View style={styles.sliderCardContentHolder}>
        <View style={styles.audioTimer}>
          <Text style={styles.textStyles}>
            {currentTimeMinutes}:{currentTimeSeconds} | {' '}
          </Text>
          <Text style={styles.textStyles}>
            {minutesDuration}:{secondsDuration}
            {/* When a user exits the Travel Guide these 2 variables dont change back to 0 */}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            seekBackward(10);
          }}>
          <Image
            source={backbutton}
            style={styles.seekButtons}
          />
        </TouchableOpacity>

        <View style={styles.sliderCardSliderHolder}>
          <Slider
            style={{width: 250, height: 20, opacity: 10}}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#b4eb34"
            maximumTrackTintColor="#eb344c"
            value={calculateSeekBar()}
            onSlidingComplete={value => {
              handleSeekBarChange(value);
            }}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            seekForward(10);
          }}>
          <Image
            source={forwardbutton}
            style={styles.seekButtons}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  seekButtons: {
   width: 27,
   height: 27,
   resizeMode: 'cover',
},
  textStyles: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Lexend-Regular',
  },
  audioTimer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    flexDirection: 'row',
  },
  sliderCardSliderHolder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderCardHolder: {
    position: 'absolute',
    zIndex: 2,
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 155,
    padding: 10,
    width: Dimensions.get('window').width,
  },
  sliderCardContentHolder: {
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
  bottomCardWebView: {
    backgroundColor: 'black',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
  },
});
