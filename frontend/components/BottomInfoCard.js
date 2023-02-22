import React, {useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import playIcon from '../assets/play_1.png';
import pauseIcon from '../assets/pause_1.png';
import {WebView} from 'react-native-webview';

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
    dirDistance, //might use this for UI enhancement so don't remove
    destinationDistance,
    setModalVisible,
    resetRouteVariables,
    setRunningIti,
    setShowDirection,
    setShowRating
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
    bottomCardWebView: {
      backgroundColor: '#AA96DA',
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
            source={{uri: placeInfo[tgNumber].imageUrl}}
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
              fontWeight: 'bold',
              fontSize: 18,
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
                    marginLeft: 10,
                  }}>
                  {currentlyPlaying[1]
                    ? 'Pause Audio'
                    : currentlyPlaying[0] == tg[tgNumber]._id
                    ? 'Resume Audio'
                    : 'Play Audio'}
                </Text>
                {tgNumber == tg.length - 1 && (
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 5,
                      padding: 5,
                    }}
                    onPress={() => {
                      setModalVisible(true);
                      setRunningIti(false);
                      setShowDirection(true);
                      setShowRating(true);
                      resetRouteVariables();
                    }}
                    >
                    <Text
                      style={{
                        color: '#AA96DA',
                        fontSize: 15,
                        fontWeight: '500',
                        textAlignVertical: 'center',
                        textAlignHorizontal: 'center',
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
