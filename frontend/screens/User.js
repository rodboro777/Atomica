import { View, SafeAreaView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import {
    Avatar,
    Title,
    Caption,
    Text,
    TouchableRipple,
  } from 'react-native-paper';
  
  import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
  import { useNavigation } from '@react-navigation/native';


export default function User() {
  const navigation = useNavigation();
  function handlePress() {
    navigation.navigate('Edit User');
  }
  return (
    <SafeAreaView>
        <View style={styles.userInfoSection}>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <Avatar.Image 
            source={require('../assets/avatar.png')}
            size={80}
          />
          <View style={{marginLeft: 20}}>
            <Title style={[styles.title, {
              marginTop:15,
              marginBottom: 5,
            }]}>John Doe</Title>
            <Caption style={styles.caption}>@j_doe</Caption>
          </View>
          <TouchableOpacity onPress={handlePress}>
          <Image source={require('../assets/edituser.png')} style={{height: 30, width: 30, marginLeft: 100}}/>
          </TouchableOpacity>

        </View>
      </View>

      <View style={styles.userInfoSection}>
        <View style={styles.row}>
          <Image source={require('../assets/destination.png')} style={styles.icon}/>
          <Text style={{color:"#777777", marginLeft: 20, fontWeight: '600', fontSize: 16, lineHeight: 26,}}>Dundalk, Ireland</Text>
        </View>
        <View style={styles.row}>
        <Image source={require('../assets/phone.png')} style={styles.icon}/>
          <Text style={{color:"#777777", marginLeft: 20, fontWeight: '600', fontSize: 16, lineHeight: 26}}>+353-123456789</Text>
        </View>
        <View style={styles.row}>
        <Image source={require('../assets/email.png')} style={styles.icon}/>
          <Text style={{color:"#777777", marginLeft: 20, fontWeight: '600', fontSize: 16, lineHeight: 26}}>john_doe@email.com</Text>
        </View>
      </View>

      <View style={styles.menuWrapper}>
        <TouchableRipple>
          <View style={styles.menuItem}>
            <Icon name="share-outline" color="#FF6347" size={25}/>
            <Text style={styles.menuItemText}>Tell Your Friends</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <Icon name="account-check-outline" color="#FF6347" size={25}/>
            <Text style={styles.menuItemText}>Support</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
          <Image source={require('../assets/settings.png')} style={styles.icon}/>
            <Text style={styles.menuItemText}>Settings</Text>
          </View>
        </TouchableRipple>
      </View>
    </SafeAreaView>
    
      
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    userInfoSection: {
      paddingHorizontal: 30,
      marginBottom: 25,
      marginTop: 10
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
      fontWeight: '500',
    },
    row: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    infoBoxWrapper: {
      borderBottomColor: '#dddddd',
      borderBottomWidth: 1,
      borderTopColor: '#dddddd',
      borderTopWidth: 1,
      flexDirection: 'row',
      height: 100,
    },
    infoBox: {
      width: '50%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuWrapper: {
      marginTop: 10,
    },
    menuItem: {
      flexDirection: 'row',
      paddingVertical: 15,
      paddingHorizontal: 30,
    },
    menuItemText: {
      color: '#777777',
      marginLeft: 20,
      fontWeight: '600',
      fontSize: 16,
      lineHeight: 26,
    },
    icon: {
      height: 40,
      width: 40,
    }
  });