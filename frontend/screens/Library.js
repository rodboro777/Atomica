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
import {useIsFocused} from '@react-navigation/native';

const Library = ({navigation}) => {
  const [travelGuides, setTravelGuides] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    fetch('http://192.168.178.168:8000/travelGuide/byUser', {
      credentials: 'include',
      method: 'GET',
    })
      .then(res => res.json())
      .then(resBody => {
        setTravelGuides(resBody.travelGuides);
      })
      .catch(err => {
        console.log(err);
      });
    fetch('http://192.168.178.168:8000/itinerary/byUser', {
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

  async function handleDelete(type, id) {
    if (type === 'itinerary') {
      fetch(`http://192.168.178.168:8000/itinerary?id=${id}`, {
        credentials: 'include',
        method: 'DELETE',
      })
        .then(res => res.json())
        .then(resBody => {
          console.log('success');
          //remove itinerary from itineraries
          setItineraries(itineraries.filter(itinerary => itinerary._id !== id));
        })
        .catch(err => {
          console.log('error');
          console.log(err);
        });
    } else {
      fetch(`http://192.168.178.168:8000/travelGuide?id=${id}`, {
        credentials: 'include',
        method: 'DELETE',
      })
        .then(res => res.json())
        .then(resBody => {
          console.log('success');
          setTravelGuides(
            travelGuides.filter(travelGuide => travelGuide._id !== id),
          );
        })
        .catch(err => {
          console.log('error');
          console.log(err);
        });
    }
  }

  const Item_ITI = ({title, desc, id}) => (
    <View style={styles.item}>
      <View style={{marginLeft: 10}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.title}>{title}</Text>
          <Image
            source={EditIcon}
            style={{
              height: 20,
              tintColor: '#fff',
              width: 20,
              marginRight: 10,
              position: 'absolute',
              right: 0,
              marginTop: 14,
            }}
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={DownloadIcon}
            style={{height: 20, tintColor: '#000', width: 20, marginRight: 10}}
          />
          <Text style={styles.desc}>{desc}</Text>
        </View>
        <TouchableOpacity
          style={{
            height: 20,
            tintColor: '#fff',
            width: 20,
            marginRight: 10,
            position: 'absolute',
            right: 30,
            marginTop: 15,
          }}
          onPress={() => handleDelete('itinerary', id)}>
          <Image
            source={DeleteIcon}
            style={{
              height: 20,
              tintColor: '#fff',
              width: 20,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
  const Item_TG = ({title, desc}) => (
    <View style={styles.item}>
      <View style={{marginLeft: 10}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.title}>{title}</Text>
          <Image
            source={EditIcon}
            style={{
              height: 20,
              tintColor: '#fff',
              width: 20,
              marginRight: 10,
              position: 'absolute',
              right: 0,
              marginTop: 14,
            }}
          />
          <TouchableOpacity
            style={{
              height: 20,
              tintColor: '#fff',
              width: 20,
              marginRight: 10,
              position: 'absolute',
              right: 30,
              marginTop: 15,
            }}>
            <Image
              source={DeleteIcon}
              style={{
                height: 20,
                tintColor: '#fff',
                width: 20,
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={DownloadIcon}
            style={{height: 20, tintColor: '#000', width: 20, marginRight: 10}}
          />
          <Text style={styles.desc}>{desc}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.buttonItiStyle}
          activeOpacity={0.5}
          onPress={() => navigation.navigate('Create Itinerary')}>
          <Image source={Plus} style={styles.buttonImageIconStyle} />
          <View style={styles.buttonIconSeparatorStyle} />
          <Text style={styles.buttonTextStyle}>Create Itinerary</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonTGStyle}
          activeOpacity={0.5}
          onPress={() => navigation.navigate('Create TravelGuide')}>
          <Image source={Plus} style={styles.buttonImageIconStyle} />
          <View style={styles.buttonIconSeparatorStyle} />
          <Text style={styles.buttonTextStyle}>Create Travel Guide</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.buttonHeaderStyle}>Itinerary</Text>
          <FlatList
            data={itineraries}
            renderItem={({item}) => (
              <Item_ITI
                title={item.name}
                desc={item.description}
                id={item._id}
              />
            )}
            keyExtractor={item => item._id}
          />
        </View>
        <View>
          <Text style={styles.buttonHeaderStyle}>TravelGuide</Text>
          <FlatList
            keyExtractor={item => item._id}
            data={travelGuides}
            renderItem={({item}) => (
              <Item_TG title={item.name} desc={item.description} />
            )}
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
    backgroundColor: '#C5FAD5',
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
    backgroundColor: '#485a96',
    borderWidth: 0.5,
    borderColor: '#fff',
    height: 40,
    borderRadius: 5,
    margin: 5,
    marginTop: 10,
  },
  buttonImageIconStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
    tintColor: 'white',
  },
  buttonTextStyle: {
    color: '#fff',
    marginBottom: 4,
    marginLeft: 10,
    fontWeight: 'bold',
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
    fontFamily: 'monospace',
  },
  item: {
    backgroundColor: '#AA96DA',
    padding: 5,
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  desc: {
    fontSize: 15,
    color: '#403f3d',
    fontWeight: 'bold',
  },
});
