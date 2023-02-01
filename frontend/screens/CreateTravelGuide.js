import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Plus from '../assets/plus.png';
import Upload from '../assets/upload.png';
import Eye from '../assets/eye.png';
import CEye from '../assets/ceye.png';
import Done from '../assets/done.png';


export default function CreateTravelGuide() {
  const [locations, setLocations] = React.useState([]);
    const [eicon, setEicon] = React.useState(Eye);

    const getLocation = () => {
      if(route.params.paramKey == null) {
        setLocations(null)
      }else {
         setLocations(route.params.paramKey);
      }
       
        navigation.navigate('SearchPlaces')
    }

  return (
    <View style={styles.container}>
      <TextInput 
        placeholder='Type Itinerary title here..'
        placeholderTextColor = "#9a73ef" 
        style={styles.input}
        />
    <TouchableOpacity
          style={styles.buttonItiStyle}
          activeOpacity={0.5}
          //onPress={getLocation()}
          >
          <Image
            source={Plus}
            style={styles.buttonImageIconStyle}
          />
          <View style={styles.buttonIconSeparatorStyle} />
          <Text style={styles.buttonTextStyle}>Add Location</Text>
    </TouchableOpacity>
    <TextInput 
        placeholder='Locations...'
        placeholderTextColor = "#9a73ef" 
        style={styles.input}
        />
     <TextInput 
        placeholder='Description...'
        placeholderTextColor = "#9a73ef" 
        style={styles.description}
        />
      <TouchableOpacity
          style={styles.buttonItiStyle}
          activeOpacity={0.5}
          //onPress={getLocation()}
          >
          <Image
            source={Upload}
            style={styles.buttonImageIconStyle}
          />
          <View style={styles.buttonIconSeparatorStyle} />
          <Text style={styles.buttonTextStyle}>Upload Audio</Text>
      </TouchableOpacity>
      <TouchableOpacity
          style={styles.buttonItiStyle}
          activeOpacity={0.5}
          onPress={() => setEicon(CEye)}
          >
          <Image
            source={eicon}
            style={styles.buttonImageIconStyle}
          />
          <View style={styles.buttonIconSeparatorStyle} />
          <Text style={styles.buttonTextStyle}>Public</Text>
      </TouchableOpacity>
      <View style={{justifyContent: 'center', alignContent: 'center', alignItems:'center'}}>
       <TouchableOpacity
          style={styles.buttonDONEStyle}
          activeOpacity={0.5}
          onPress={() => setEicon(CEye)}
          >
          <Image
            source={Done}
            style={styles.buttonImageIconStyle}
          />
      </TouchableOpacity> 
      </View>
      
    </View>
  )
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
    buttonDONEStyle: {
      alignItems: 'center',
      backgroundColor: '#485a96',
      borderWidth: 0.5,
      borderColor: '#fff',
      height: 40,
      borderRadius: 5,
      margin: 5,
      marginTop: 50,
      width: 100,
      justifyContent: 'center'
    }
});