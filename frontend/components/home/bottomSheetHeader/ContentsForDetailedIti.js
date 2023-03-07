import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import ArrowIcon from '../../../assets/arrow.png';
import Itinerary from '../../Itinerary';

export default function ContentsForDetailedIti(props) {
  const {
    selectedItinerary,
    setCurrentBottomSheetType,
    prevType,
    setRunningRoute,
    setShowDetailIti,
    setShowDirection,
    sheetRef
  } = props;

  const styles = StyleSheet.create({
    detailItiBackBtn: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 40,
      height: 40,
      marginLeft: 5,
    },
    startBtn: {
      borderWidth: 1,
      backgroundColor: 'black',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 5,
      borderRadius: 10,
      width: 80,
      marginRight: 5,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
  });

  return (
    <View
      style={{
        width: '100%',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f2f5',
      }}>
      <View
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          style={styles.detailItiBackBtn}
          onPress={() => {
            setCurrentBottomSheetType(prevType);
            setShowDetailIti(false);
            setShowDirection(false);
            sheetRef.current.snapTo(2);
          }}>
          <Image
            source={ArrowIcon}
            style={{
              width: '100%',
              height: '100%',
              transform: [{rotate: '180deg'}],
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => {
            setRunningRoute(true);
          }}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'Lexend-Light',
              fontSize: 17,
              letterSpacing: 0.3,
            }}>
            start
          </Text>
        </TouchableOpacity>
      </View>
      <Itinerary item={selectedItinerary} isDetail={true}/>
    </View>
  );
}
