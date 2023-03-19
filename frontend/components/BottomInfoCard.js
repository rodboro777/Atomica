import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import playIcon from '../assets/play_1.png';
import pauseIcon from '../assets/pause_1.png';
import {WebView} from 'react-native-webview';
import SoundPlayer from 'react-native-sound-player';
import SeekBar from '../components/SeekBar';

export default function BottomInfoCard(props) {
  const {
    tgNumber,
    nextRouteInfo,
    tg,
    showDirection,
    directionIdx,
    dirDistance, //might use this for UI enhancement so don't remove
    destinationDistance,
    resetRouteVariables,
    setRunningIti,
    setShowDirection,
    setCurrentBottomSheetType,
    currentSpecialScreen,
    setCurrentSpecialScreen,
    deactivateTravelGuideNav,
    setAudioTime,
  } = props;

  const [isPaused, setPaused] = useState(true);
  const [currentPlayingTG, setCurrentPlayingTG] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function handleAudioButtonPress() {
    if (!currentPlayingTG || currentPlayingTG != tg[tgNumber]._id) {
      setPaused(false);
      setCurrentPlayingTG(tg[tgNumber]._id);
      SoundPlayer.play();
    } else if (isPaused) {
      SoundPlayer.resume();
      setPaused(false);
    } else {
      SoundPlayer.pause();
      setPaused(true);
    }
  }

  useEffect(() => {
    if (!showDirection) {
      SoundPlayer.stop();
      SoundPlayer.loadUrl(tg[tgNumber].audioUrl);
    }
  }, [showDirection]);

  useEffect(() => {
    SoundPlayer.addEventListener('FinishedLoadingURL', ({success, url}) => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!isPaused) {
      async function getInfo() {
        const res = await SoundPlayer.getInfo();
        setAudioTime(res.currentTime);
      }
      const intervalId = setInterval(() => {
        getInfo();
      }, 1000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isPaused]);

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
      backgroundColor: 'black',
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
    bottomCardWebView: {
      backgroundColor: 'black',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
    },
  });

  const handleViewportMeta = () => {
    const viewportMeta =
      "var meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);";
    return viewportMeta;
  };
  return (
    <View style={styles.bottomCardHolder}>
      <View style={styles.bottomCardContentHolder}>
        <View style={styles.bottomCardImageHolder}>
          <Image
            source={{uri: tg[tgNumber].imageUrl}}
            style={{flex: 1, borderRadius: 10}}
          />
        </View>
        <View style={styles.bottomCardInfoHolder}>
          {nextRouteInfo && (
            <WebView
              style={styles.bottomCardWebView}
              bounces={false}
              scalesPageToFit={false}
              domStorageEnabled={true}
              useWebView2={true}
              javaScriptEnabled={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              onMessage={event => {
                if (event.nativeEvent.data === 'viewportmeta') {
                  event.target.injectJavaScript(handleViewportMeta());
                }
              }}
              source={{
                html: `<p style="color:white; font-size:5.8vw; font-weight: 400; margin-left:-3vw;">${
                  showDirection
                    ? nextRouteInfo[directionIdx].html_instructions
                    : 'Destination Reached'
                }</p>`,
              }}
            />
          )}
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontFamily: 'Lexend-Regular',
            }}>
            {tg[tgNumber].locationName}
          </Text>
          <View style={styles.bottomCardPlayerHolder}>
            {showDirection ? (
              <View style={{flexDirection: 'row', marginTop: 20}}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 15,
                    fontWeight: '400',
                    fontFamily: 'Lexend-Light',
                  }}>
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
                    handleAudioButtonPress();
                  }}>
                  {isLoading?
                  <ActivityIndicator size="small" color="white" />
                  :<Image
                    source={isPaused ? playIcon : pauseIcon}
                    style={{width: 30, height: 30, resizeMode: 'cover'}}
                  />}
                </TouchableOpacity>
                <Text
                  style={{
                    flex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlignVertical: 'center',
                    color: 'white',
                    marginLeft: 20,
                    fontFamily: 'Lexend-ExtraLight',
                  }}>
                  {!isPaused
                    ? 'Pause Audio'
                    : currentPlayingTG == tg[tgNumber]._id
                    ? 'Resume Audio'
                    : 'Play Audio'}
                </Text>
                {tgNumber == tg.length - 1 && (
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 5,
                      padding: 5,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                    }}
                    onPress={() => {
                      setRunningIti(false);
                      if (currentSpecialScreen == 'travelGuideNavigation') {
                        deactivateTravelGuideNav();
                      } else {
                        setShowDirection(true);
                        setCurrentBottomSheetType('contentsForRating');
                      }
                      resetRouteVariables();
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 15,
                        letterSpacing: 0.3,
                        textAlignVertical: 'center',
                        textAlignHorizontal: 'center',
                        fontFamily: 'Lexend-Regular',
                      }}>
                      End Tour
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
