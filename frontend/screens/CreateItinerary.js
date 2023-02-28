import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {React, useState, useRef, useEffect} from 'react';
import Done from '../assets/done.png';
import axios from 'axios';
import ip from '../ip';
import upArrow from '../assets/uparrow.png';
import DocumentPicker from 'react-native-document-picker';
import camera from '../assets/camera.png';
import trash from '../assets/trash.png';

export default function CreateItinerary({navigation, route}) {
  const {item, isEdit} = route.params;
  const [itinerary, setItinerary] = useState({
    title: isEdit ? item.name : '',
    travelGuides: isEdit ? item.travelGuides && item.travelGuides : [],
    description: isEdit ? item.description : '',
    uploadedImage: null,
    imageUrl: isEdit ? item.imageUrl : '',
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [availableTravelGuides, setAvailableTravelGuides] = useState([]);
  const isEmpty = useRef(true);
  const [search, setSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSearch(name) {
    if (name.trim().length == 0) {
      setAvailableTravelGuides([]);
      isEmpty.current = true;
      return;
    }
    await fetch(`http://${ip.ip}:8000/travelGuide/startsWith?prefix=${name}`, {
      credentials: 'include',
      method: 'GET',
    })
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
    const formdata = new FormData();
    formdata.append('imageFile', itinerary.uploadedImage);
    formdata.append('name', itinerary.title);
    formdata.append('description', itinerary.description);
    formdata.append('travelGuideId', JSON.stringify(tgId));
    formdata.append('rating', item.rating);
    formdata.append('ratingCount', item.ratingCount);
    if (isEdit) {
      formdata.append('id', item._id);
      if (itinerary.uploadedImage == null) {
        formdata.append('imageUrl', itinerary.imageUrl);
      }
    }
    await fetch(`http://${ip.ip}:8000/itinerary`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'POST',
      body: formdata,
    })
      .then(res => res.json())
      .then(resBody => {
        console.log('success');
        navigation.navigate('User', {origin: 'CreateItinerary'});
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (isEdit) {
      axios
        .post(`http://${ip.ip}:8000/travelGuide/byIds`, item.travelGuideId)
        .then(res => {
          setItinerary({
            ...itinerary,
            travelGuides: res.data.travelGuides,
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, []);
  async function handleDelete(id) {
    fetch(`http://${ip.ip}:8000/itinerary?id=${id}`, {
      credentials: 'include',
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(resBody => {
        navigation.navigate('User');
      })
      .catch(err => {
        console.log('error');
        console.log(err);
      });
  }

  return (
    <View style={styles.container}>
      {confirmDelete && (
        <View
          style={{
            position: 'absolute',
            zIndex: 3,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              height: '30%',
              width: '80%',
              backgroundColor: 'white',
              borderRadius: 10,
            }}>
            <Text
              style={{
                padding: 10,
                fontFamily: 'Lexend-Regular',
                fontSize: 15,
                letterSpacing: 1,
                color: 'black',
                marginTop: 10,
                textAlign: 'center',
              }}>
              Are you sure you want to delete this itinerary?
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 'auto',
                padding: 10,
                height: 100,
                display: 'flex',
                justifyContent: 'space-around',
              }}>
              <TouchableOpacity
                style={{...styles.buttonDONEStyle, backgroundColor: 'red'}}
                disabled={submitting}
                onPress={() => {
                  setSubmitting(true);
                  handleDelete(item._id);
                }}>
                {submitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text
                    style={{color: 'white', fontWeight: 'bold', fontSize: 17}}>
                    Yes
                  </Text>
                )}
              </TouchableOpacity>
              {!submitting && (
                <TouchableOpacity
                  style={{...styles.buttonDONEStyle}}
                  onPress={() => {
                    setConfirmDelete(false);
                  }}>
                  <Text
                    style={{color: 'white', fontWeight: 'bold', fontSize: 17}}>
                    No
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}
      <View style={styles.pageNameHolder}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: 20,
            transform: [{rotate: '-90deg'}],
            height: 30,
            width: 30,
          }}
          onPress={() => navigation.navigate('User')}>
          <Image
            source={upArrow}
            style={{tintColor: 'black', width: '100%', height: '100%'}}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: 'Lexend-Light',
            fontSize: 20,
            letterSpacing: 1,
            color: 'black',
          }}>
          {isEdit ? 'Edit Itinerary' : 'Create Itinerary'}
        </Text>
      </View>

      <TextInput
        placeholder="Itinerary Title..."
        placeholderTextColor="black"
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
          style={{
            flex: 1,
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 5,
            fontFamily: 'Lexend-Regular',
            padding: 10,
            backgroundColor: 'black',
            color: 'white',
          }}
          placeholder="Search for travel guides"
          placeholderTextColor={'white'}
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
              <Text style={{fontFamily: 'Lexend-Regular'}}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <View>
        <FlatList
          style={styles.choosenTravelGuideList}
          data={itinerary.travelGuides && itinerary.travelGuides}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <View style={styles.choosenTravelGuideItem} key={item._id}>
              <Text
                style={{
                  fontFamily: 'Lexend-Light',
                  fontSize: 15,
                  letterSpacing: 1,
                  color: 'black',
                }}>
                {item.name}
              </Text>
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
                <Image
                  source={trash}
                  style={{height: '100%', width: '100%', tintColor: 'black'}}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      <TextInput
        placeholder="Description..."
        placeholderTextColor="black"
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
          flexDirection: 'row',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            backgroundColor: 'white',
            height: 60,
            width: '35%',
            borderRadius: 20,
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: 10,
          }}
          activeOpacity={0.5}
          onPress={async () => {
            try {
              const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
              });
              console.log(result[0]);
              setItinerary({
                ...itinerary,
                uploadedImage: result[0],
              });
            } catch (error) {
              console.log(error);
            }
          }}>
          <Image
            source={camera}
            style={{
              tintColor: 'black',
              width: 25,
              height: 25,
            }}
          />
          <Text
            style={{
              color: 'black',
              fontFamily: 'Lexend-Light',
            }}>
            Upload Image
          </Text>
        </TouchableOpacity>
        {isEdit
          ? itinerary.imageUrl !== ''
          : itinerary.uploadedImage && (
              <Image
                source={{
                  uri:
                    itinerary.imageUrl !== ''
                      ? itinerary.imageUrl
                      : itinerary.uploadedImage.uri,
                }}
                style={{
                  width: 180,
                  height: 100,
                  borderRadius: 20,
                  resizeMode: 'cover',
                }}
              />
            )}
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          marginTop: 30,
          padding: 10,
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <TouchableOpacity
          style={styles.buttonDONEStyle}
          activeOpacity={0.5}
          onPress={() => {
            setSubmitting(true);
            createItinerary();
          }}>
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Image source={Done} style={styles.buttonImageIconStyle} />
          )}
        </TouchableOpacity>
        {isEdit && (
          <TouchableOpacity
            style={{
              ...styles.buttonDONEStyle,
              backgroundColor: 'black',
            }}
            activeOpacity={0.5}
            onPress={() => {
              setConfirmDelete(true);
            }}>
            <Image
              source={trash}
              style={{...styles.buttonImageIconStyle, tintColor: 'red'}}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
    backgroundColor: 'white',
  },
  pageNameHolder: {
    width: '100%',
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'white',
    height: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 6,
  },
  input: {
    fontSize: 18,
    margin: 10,
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'white',
    color: 'black',
    fontFamily: 'Lexend-Light',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(224, 212, 212)',
  },
  description: {
    margin: 10,
    borderRadius: 10,
    fontSize: 15,
    fontFamily: 'Lexend-Regular',
    color: 'black',
    minHeight: 200,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    textAlignVertical: 'top',
    padding: 10,
  },
  buttonItiStyle: {
    borderWidth: 1,
    width: '35%',
    height: 60,
  },
  buttonImageIconStyle: {
    height: 30,
    width: 30,
    resizeMode: 'stretch',
    tintColor: 'white',
  },
  buttonTextStyle: {
    color: '#fff',
    marginBottom: 4,
    marginLeft: 10,
    fontWeight: 'bold',
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
    width: 150,
    borderRadius: 20,
    height: 50,
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 6,
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
    height: 150,
    textAlign: 'center',
    borderColor: 'black',
    backgroundColor: 'whitesmoke',
  },
  choosenTravelGuideItem: {
    padding: 10,
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    flexDirection: 'row',
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderWidth: 1,
    borderColor: 'rgb(224, 212, 212)',
  },
  removeButton: {
    width: 20,
    height: 20,
  },
});
