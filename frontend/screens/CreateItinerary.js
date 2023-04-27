import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, ActivityIndicator,
} from 'react-native';
import { React, useState, useRef, useEffect } from 'react';
import Done from '../assets/done.png';
import axios from 'axios';
import ip from '../ip';
import upArrow from '../assets/uparrow.png';
import DocumentPicker from 'react-native-document-picker';
import camera from '../assets/camera.png';
import trash from '../assets/trash.png';
import TravelGuide from '../components/TravelGuide';

export default function CreateItinerary({ navigation, route }) {

  const ownerId = route.params.ownerId;
  const [selectedItems, setMySelectedItems] = useState([]);
  useEffect(() => {
    setMySelectedItems(route.params.selectedItems);
  }, [route.params.selectedItems]);


  const { item, isEdit } = route.params;
  const [itinerary, setItinerary] = useState({
    title: isEdit ? item.name : '',
    travelGuides: isEdit ? item.travelGuides && item.travelGuides : [],
    description: isEdit ? item.description : '',
    uploadedImage: null,
    imageUrl: isEdit ? item.imageUrl : '',
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentPlayingTG, setCurrentPlayingTG] = useState(null);
  const [ownerInfo, setOwnerInfo] = useState({
    id: ownerId,
    fullName: '',
    country: '',
  });

  const [contentList, setContentList] = useState([]);

  fetch(`http://${ip.ip}:8000/user/info?id=${ownerId}`, {
    credentials: 'include',
    method: 'GET',
  })
    .then(res => res.json())
    .then(resBody => {
      if (resBody.statusCode == 200) {
        setOwnerInfo({
          ...ownerInfo,
          fullName: resBody.info.firstName + ' ' + resBody.info.lastName,
          country: resBody.info.country,
          username: resBody.info.username,
          imageUrl: resBody.info.imageUrl,
        });
      } else {
        navigation.navigate('MyTabs');
      }
    });


  // Get the travel guides created based on the selected items
  useEffect(() => {


    console.log('selectedItems : ', selectedItems);
    if (!selectedItems || selectedItems.length === 0) {
      return; // do nothing if selectedItems is undefined or empty
    }
    console.log('useffect called ');
    const fetchData = async () => {
      try {
        const promises = selectedItems.map((id) => axios.get(`http://${ip.ip}:8000/travelGuide?id=${id}`));
        const responses = await Promise.all(promises);
        const guides = [];
        responses.forEach((response) => {
          if (response.data && response.data.travelGuide) {

            guides.push(response.data.travelGuide);

          }
        });
        const contentList = [];
        guides.forEach((tg) => {
          contentList.push({
            id: tg._id,
            type: 'travelGuide',
            travelGuide: tg,
          });
        });
        setContentList(contentList);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [selectedItems]);

  useEffect(() => {
    if (isEdit) {
      console.log("is edit is enabled" + isEdit)
      console.log(item.travelGuideId);

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
      formdata.append('itineraryId', item._id);
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
        navigation.navigate('User', { origin: 'CreateItinerary' });
      })
      .catch(err => {
        console.log(err);
      });
  };

  function renderItem({ item }) {
    if (item.type == 'travelGuide') {
      return (
        <View style={styles.travelGuideContainer}>
          <TravelGuide
            travelGuide={item.travelGuide}
            currentPlayingTG={currentPlayingTG}
            setCurrentPlayingTG={setCurrentPlayingTG}
            isUserProfilePage={true}
            navigation={navigation}
            itineraryMode={true}
          />
          <TouchableOpacity style={styles.deleteButton} onPress={() => {
            console.log('touchable opacity called for ID' + item.travelGuide._id)
            handleRemove(item.travelGuide._id)
          }}>
            <Text style={styles.deleteButtonText}>X</Text>
          </TouchableOpacity>
        </View>

      );
    }
  }

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

  // Remove travel guide from travelGuides array
  function handleRemove(id) {

    // Remove travel guide from contentList array
    setContentList(contentList.filter(item => item.id !== id));
    setMySelectedItems(selectedItems.filter((selectedItem) => selectedItem !== id));

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
                style={{ ...styles.buttonDONEStyle, backgroundColor: 'red' }}
                disabled={submitting}
                onPress={() => {
                  setSubmitting(true);
                  handleDelete(item._id);
                }}>
                {submitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text
                    style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>
                    Yes
                  </Text>
                )}
              </TouchableOpacity>
              {!submitting && (
                <TouchableOpacity
                  style={{ ...styles.buttonDONEStyle }}
                  onPress={() => {
                    setConfirmDelete(false);
                  }}>
                  <Text
                    style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>
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
            transform: [{ rotate: '-90deg' }],
            height: 30,
            width: 30,
          }}
          onPress={() => navigation.navigate('User')}>
          <Image
            source={upArrow}
            style={{ tintColor: 'black', width: '100%', height: '100%' }}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: 'Lexend-Light',
            fontSize: 20,
            letterSpacing: 1,
            color: 'black',
          }}>
          {isEdit ? 'Edit Itinerary ✍️' : 'Create Itinerary 🚀'}
        </Text>
      </View>
      <Text
        style={styles.headers}>
        {'Name it'}
      </Text>
      <TextInput
        placeholder="Title..."
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
      <Text
        style={styles.headers}>
        {'Added travel guides'}
      </Text>

      {selectedItems.length > 0 ? (

        <View style={{ height: '30%' }}>
          <FlatList
            data={contentList}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            bounces={false}
            alwaysBounceVertical={false}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            stickyHeaderIndices={[2]}
            horizontal={true} // set horizontal prop to true
            // center items horizontally
            snapToInterval={Dimensions.get('window').width} // snap to the width of the screen
            decelerationRate={0.9} // adjust the deceleration rate
          />
        </View>
      ) : (
        <TouchableOpacity
          style={styles.travelGuideItem}

          onPress={() => {
            navigation.navigate('Add TravelGuide', { item: {}, isEdit: false, ownerId: ownerId });
          }}>

          <Text style={{ fontFamily: 'Cereal_thicc' }}>+</Text>
          <Text style={{ fontFamily: 'Lexend-Regular' }}>{item.name}</Text>
        </TouchableOpacity>
      )}



      {/* <View>
        <FlatList
          style={styles.choosenTravelGuideList}
          data={itinerary.travelGuides && itinerary.travelGuides}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
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
                  style={{ height: '100%', width: '100%', tintColor: 'black' }}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      </View> */}
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
              style={{ ...styles.buttonImageIconStyle, tintColor: 'red' }}
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
    marginTop: 0,
    borderRadius: 10,
    fontSize: 15,
    fontFamily: 'Cereal_Medium',
    color: 'black',
    minHeight: 100,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 3,
    shadowRadius: 1.41,
    elevation: 5,
    textAlignVertical: 'top',
    padding: 10,
    border: '1px solid `rgb(245,245,245)`',
    borderTopWidth: 1,
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
  travelGuideContainer: {
    height: "200%",
    backgroundColor: 'black',
    width: Dimensions.get('window').width - 40, // subtract some margin from the screen width
    marginRight: 20, // add some margin between items
    borderRadius: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
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
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 10,
    height: 50,
    minHeight: 200,
  },
  travelGuideItem: {
    textAlign: 'center',
    padding: 10,
    margin: 10,
    marginLeft: 20,
    color: 'black',
    width: '40%',
    borderStyle: 'dashed',
    marginTop: 10,
    borderWidth: 3,
    width: '30%',
    borderRadius: 10,
  },
  choosenTravelGuideList: {
    height: 50,
    textAlign: 'center',
    borderColor: 'black',
    backgroundColor: 'whitesmoke',
  },
  headers:
  {
    fontFamily: 'Cereal_bold',
    marginTop: 10,
    marginLeft: 20,
    fontSize: 20,
    letterSpacing: 1,
    color: 'black',
  },

  input: {
    fontSize: 17,
    margin: 23,
    borderRadius: 10,
    marginTop: 20,
    width: '90%',
    backgroundColor: 'white',
    color: 'black',
    fontFamily: 'Cereal_Medium',
    borderBottomWidth: 2,
    borderBottomColor: 'grey',
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
