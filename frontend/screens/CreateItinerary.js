import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
  FlatList,
  ScrollView,
} from 'react-native';
import {React, useState, useRef} from 'react';
import Eye from '../assets/eye.png';
import CEye from '../assets/ceye.png';
import Done from '../assets/done.png';
import axios from 'axios';
import ip from '../ip';

export default function CreateItinerary({navigation, route}) {
  const [itinerary, setItinerary] = useState({
    title: '',
    travelGuides: [],
    description: '',
  });
  const [availableTravelGuides, setAvailableTravelGuides] = useState([]);
  const isEmpty = useRef(true);
  const [search, setSearch] = useState('');

  async function handleSearch(name) {
    if (name.trim().length == 0) {
      setAvailableTravelGuides([]);
      isEmpty.current = true;
      return;
    }
    await fetch(
      `http://${ip.ip}:8000/travelGuide/startsWith?prefix=${name}`,
      {
        credentials: 'include',
        method: 'GET',
      },
    )
      .then(res => res.json())
      .then(resBody => {
        if (resBody.travelGuides.length > 0) {
          setAvailableTravelGuides(resBody.travelGuides);
        }
        if (availableTravelGuides.length > 0) {
          isEmpty.current = false;
        }
      });
  }

  function addTravelGuide(item) {
    isEmpty.current = true;
    setSearch('');
    if (itinerary.travelGuides.find(tg => tg._id == item._id)) return;
    setItinerary({
      ...itinerary,
      travelGuides: [
        ...itinerary.travelGuides,
        {_id: item._id, name: item.name},
      ],
    });
  }

  const createItinerary = async () => {
    const tgId = itinerary.travelGuides.map(tg => tg._id);
    const formData = new FormData();
    formData.append('name', itinerary.title);
    formData.append('description', itinerary.description);
    formData.append('travelGuideIds', tgId);
    const data = {
      name: itinerary.title,
      description: itinerary.description,
      travelGuideIds: tgId,
    };
    await axios
      .post(`http://${ip.ip}:8000/itinerary`, data)
      .then(res => {
        console.log('success');
        navigation.navigate('Lib');
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Type Itinerary title here.."
        placeholderTextColor="#9a73ef"
        style={styles.input}
        value={itinerary.title}
        onChangeText={e => {
          setItinerary({
            ...itinerary,
            title: e,
          });
        }}
      />

      <View style={{flexDirection: 'row', padding: 10}}>
        <TextInput
          style={{flex: 1, height: 40, borderColor: 'gray', borderWidth: 1}}
          placeholder="Search for travel guides"
          value={search}
          onChangeText={e => {
            setSearch(e);
            handleSearch(e);
          }}
        />
      </View>
      {isEmpty.current == false && (
        <FlatList
          style={styles.travelGuideList}
          data={availableTravelGuides}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.travelGuideItem}
              onPressIn={() => addTravelGuide(item)}>
              <View>
                <Text>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      <ScrollView style={styles.choosenTravelGuideList}>
        {itinerary.travelGuides.map(item => (
          <View style={styles.choosenTravelGuideItem} key={item._id}>
            <Text>{item.name}</Text>
            <TouchableOpacity
              onPress={() => {
                setItinerary({
                  ...itinerary,
                  travelGuides: itinerary.travelGuides.filter(
                    tg => tg._id != item._id,
                  ),
                });
              }}
              style={styles.removeButton}>
              <Text>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <TextInput
        placeholder="Description..."
        placeholderTextColor="#9a73ef"
        style={styles.description}
        onChangeText={e => {
          setItinerary({
            ...itinerary,
            description: e,
          });
        }}
        value={itinerary.description}
      />
      <View
        style={{
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={styles.buttonDONEStyle}
          activeOpacity={0.5}
          onPress={() => {
            createItinerary();
          }}>
          <Image source={Done} style={styles.buttonImageIconStyle} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    marginTop: 0,
    padding: 30,
    backgroundColor: '#C5FAD5',
  },
  input: {
    margin: 5,
    height: 50,
    borderColor: '#7a42f4',
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 'bold',
  },
  description: {
    margin: 5,
    height: 100,
    borderColor: '#7a42f4',
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 'bold',
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
  buttonDONEStyle: {
    alignItems: 'center',
    backgroundColor: '#485a96',
    borderWidth: 0.5,
    borderColor: '#fff',
    height: 40,
    borderRadius: 5,
    margin: 5,
    marginTop: 30,
    width: 100,
    justifyContent: 'center',
  },
  MainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },

  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 12,
  },

  item: {
    padding: 8,
    backgroundColor: '#00C853',
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  itemText: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
  },

  travelGuideList: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    height: 200,
    minHeight: 200,
  },
  travelGuideItem: {
    textAlign: 'center',
    padding: 10,
    color: 'black',
    borderBottomWidth: 1,
    marginTop: 10,
  },
  choosenTravelGuideList: {
    textAlign: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'gray',
    maxHeight: 200,
    minHeight: 200,
  },
  choosenTravelGuideItem: {
    margin: 'auto',
    marginTop: 10,
    padding: 5,
    color: 'black',
    fontWeight: 'bold',
    borderBottomWidth: 1,
  },
  removeButton: {
    borderRadius: 10,
    width: 20,
    height: 20,
  },
});
