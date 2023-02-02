import React, {useState, useEffect} from "react";
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, FlatList, LogBox, ActivityIndicator} from 'react-native'
import Plus from '../assets/plus.png';
import Modal from 'react-native-modal';
import axios from 'axios';
import DownloadIcon from '../assets/download.png';
import EditIcon from '../assets/pencil.png';


const Library = ({navigation}) => {

  const [travelGuides, setTravelGuides] = useState([]);

  useEffect(() => {
    fetch('http://192.168.176.219:8000/travelGuide/byUser', {
      credentials: 'include',
      method: 'GET'
    })
    .then(res=>res.json())
    .then(resBody => {
      setTravelGuides(resBody.travelGuides);
    })
  }, []);

  const DATA_ITI = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'Itinerary 1',
      desc: 'Spongebob',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Itinerary 2',
      desc: 'Justin Timberlake',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Itinerary 3',
      desc: 'Drake',
    },
  ];

  const DATA_TG = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb2823',
      title: 'TravelGuide 1',
      desc: 'Lil Goku',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f24',
      title: 'TravelGuide 2',
      desc: 'Naruto',
    },
  ];

  const Item_ITI = ({title, desc}) => (
    <View style={styles.item}>
      <View style={{marginLeft: 10}}>
       <View style={{flexDirection: 'row'}}>
      <Text style={styles.title}>{title}</Text>
      <Image source={EditIcon} style={{height: 20, tintColor: '#fff', width: 20, marginRight: 10, position:'absolute', right: 0, marginTop: 10}}/>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Image source={DownloadIcon} style={{height: 20, tintColor: '#000', width: 20, marginRight: 10,}}/>
        <Text style={styles.desc}>{desc}</Text>
      </View>  
      </View>
    </View>
  );
  const Item_TG = ({title, desc}) => (
    <View style={styles.item}>
      <View style={{marginLeft: 10}}>
       <View style={{flexDirection: 'row'}}>
      <Text style={styles.title}>{title}</Text>
      <Image source={EditIcon} style={{height: 20, tintColor: '#fff', width: 20, marginRight: 10, position:'absolute', right: 0, marginTop: 10}}/>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Image source={DownloadIcon} style={{height: 20, tintColor: '#000', width: 20, marginRight: 10,}}/>
        <Text style={styles.desc}>{desc}</Text>
      </View>  
      </View>
    </View>
  );


    return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.buttonItiStyle}
          activeOpacity={0.5}
          onPress={() => navigation.navigate('Create Itinerary')}>
          <Image
            source={Plus}
            style={styles.buttonImageIconStyle}
          />
          <View style={styles.buttonIconSeparatorStyle} />
          <Text style={styles.buttonTextStyle}>Create Itinerary</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.buttonTGStyle} 
          activeOpacity={0.5}
          onPress={() => navigation.navigate('Create TravelGuide')}>
          <Image
            source={Plus}
            style={styles.buttonImageIconStyle}
          />
          <View style={styles.buttonIconSeparatorStyle} />
          <Text style={styles.buttonTextStyle}>Create Travel Guide</Text>
        </TouchableOpacity>
        <View>
        <Text style={styles.buttonHeaderStyle}>Itinerary</Text>
        <FlatList
        data={DATA_ITI}
        renderItem={
          ({item}) => <Item_ITI title={item.title} desc={item.desc} />}
        keyExtractor={item => item.id}
      />
      </View>
      <View>
        <Text style={styles.buttonHeaderStyle}>TravelGuide</Text>
        <FlatList
        data={travelGuides}
        renderItem={
          ({item}) => <Item_TG title={item.name} desc={item.description} />}
        keyExtractor={item => item._id}
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
        marginTop: 10
      },
      buttonImageIconStyle: {
        padding: 10,
        margin: 5,
        height: 25,
        width: 25,
        resizeMode: 'stretch',
        tintColor: 'white'
      },
      buttonTextStyle: {
        color: '#fff',
        marginBottom: 4,
        marginLeft: 10,
        fontWeight: 'bold'
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
        fontFamily: 'monospace'
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
        fontWeight: 'bold'
      }
})