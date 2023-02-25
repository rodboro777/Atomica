import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import Plus from '../assets/plus.png';
import DownloadIcon from '../assets/download.png';
import EditIcon from '../assets/pencil.png';
import DeleteIcon from '../assets/trash.png';
import PendingIcon from '../assets/pending.png';
import {useIsFocused} from '@react-navigation/native';
import ip from '../ip';

const Library = ({navigation}) => {
  const [travelGuides, setTravelGuides] = useState([]);
  const [rejectedTravelGuides, setRejectedTravelGuides] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const isFocused = useIsFocused();
  const TG_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
  };

  useEffect(() => {
    fetch(`http://${ip.ip}:8000/travelGuide/byUser`, {
      credentials: 'include',
      method: 'GET',
    })
      .then(res => res.json())
      .then(resBody => {
        let totalTravelGuides = resBody.travelGuides;
        resBody.pendingTravelGuides.forEach(tg => {
          totalTravelGuides.push({
            ...tg,
            pending: true,
          });
        });
        setTravelGuides(totalTravelGuides);
        setRejectedTravelGuides(resBody.rejectedTravelGuides);
      })
      .catch(err => {
        console.log(err);
      });
    fetch(`http://${ip.ip}:8000/itinerary/byUser`, {
      credentials: 'include',
      method: 'GET',
    })
      .then(res => res.json())
      .then(resBody => {
        setItineraries(resBody.itineraries);
      })
      .catch(err => {
        console.log(err);
      });
  }, [isFocused]);

  const Item_ITI = (res, type) => {
    return (
      <View style={styles.item}>
        <View style={{marginLeft: 10}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.title}>{res.name}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                if (type == 'Itinerary') {
                  navigation.navigate('Create Itinerary', {
                    item: res,
                    isEdit: true,
                  });
                } else if (type === TG_STATUS.APPROVED) {
                  navigation.navigate('Create TravelGuide', {
                    item: res,
                    isEdit: true,
                  });
                }
              }}>
              <Image
                source={
                  type === TG_STATUS.PENDING
                    ? PendingIcon
                    : !(type === TG_STATUS.REJECTED) && EditIcon
                }
                style={{
                  tintColor: '#fff',
                  height: '100%',
                  width: '100%',
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', width: '80%'}}>
            <Text style={styles.desc}>{res.description}</Text>
          </View>
          <View style={{flexDirection: 'row', width: '80%'}}>
            {type === TG_STATUS.REJECTED && (
              <Text style={styles.desc}>
                Comment from reviewer: {res.reviewerComment}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.buttonItiStyle}
          activeOpacity={0.5}
          onPress={() =>
            navigation.navigate('Create Itinerary', {
              item: {},
              isEdit: false,
            })
          }>
          <Text style={styles.buttonTextStyle}>Create Itinerary</Text>
          <View
            style={{
              borderWidth: 1,
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 40,
              width: 40,
              borderRadius: 40,
              borderColor: 'white',
            }}>
            <Image source={Plus} style={styles.buttonImageIconStyle} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonItiStyle}
          activeOpacity={0.5}
          onPress={() =>
            navigation.navigate('Create TravelGuide', {item: {}, isEdit: false})
          }>
          <Text style={styles.buttonTextStyle}>Create Travel Guide</Text>
          <View
            style={{
              borderWidth: 1,
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 40,
              width: 40,
              borderRadius: 40,
              borderColor: 'white',
            }}>
            <Image source={Plus} style={styles.buttonImageIconStyle} />
          </View>
        </TouchableOpacity>
        <View>
          <Text style={styles.buttonHeaderStyle}>Itineraries</Text>
          <FlatList
            data={itineraries}
            renderItem={({item}) => {
              return Item_ITI(item, 'Itinerary');
            }}
            keyExtractor={item => item._id}
          />
        </View>
        <View>
          <Text style={styles.buttonHeaderStyle}>TravelGuides</Text>
          <FlatList
            keyExtractor={item => item._id}
            data={travelGuides}
            renderItem={({item}) => {
              return Item_ITI(
                item,
                item.pending ? TG_STATUS.PENDING : TG_STATUS.APPROVED,
              );
            }}
          />
        </View>
        <View>
          <Text style={styles.buttonHeaderStyle}>Rejected TravelGuides</Text>
          <FlatList
            keyExtractor={item => item._id}
            data={rejectedTravelGuides}
            renderItem={({item}) => {
              return Item_ITI(item, TG_STATUS.REJECTED);
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Library;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    marginTop: 0,
    padding: 30,
    backgroundColor: 'whitesmoke',
  },
  buttonTGStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc4e41',
    borderWidth: 0.5,
    borderColor: '#fff',
    height: 40,
    borderRadius: 5,
    margin: 5,
  },
  buttonItiStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    borderColor: '#fff',
    borderRadius: 15,
    margin: 5,
    marginTop: 10,
    padding: 10,
    paddingLeft: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4.65,
    elevation: 10,
  },
  buttonImageIconStyle: {
    height: 30,
    width: 30,
    resizeMode: 'stretch',
    tintColor: 'white',
    borderWidth: 2,
  },
  buttonTextStyle: {
    color: '#fff',
    fontFamily: 'Lexend-Light',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  buttonHeaderStyle: {
    color: 'black',
    marginTop: 10,
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 25,
    fontFamily: 'Lexend-ExtraLight',
  },
  item: {
    backgroundColor: 'black',
    padding: 5,
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 10,
    position: 'relative',
  },
  title: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'Lexend-Regular',
  },
  desc: {
    fontSize: 15,
    color: 'white',
    fontFamily: 'Lexend-ExtraLight',
    textAlign: 'justify',
  },
  editButton: {
    width: 15,
    height: 15,
    position: 'absolute',
    right: 10,
    top: 10,
  },
});
