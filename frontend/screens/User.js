import { View, SafeAreaView, StyleSheet, FlatList, Image, TouchableOpacity, Text } from 'react-native';
import React, {useEffect, useRef} from 'react';
import {
    Avatar,
    Title,
    Caption,
    TouchableRipple,
  } from 'react-native-paper';
import { Button } from "@react-native-material/core";
  
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';



export default function User() {
  const navigation = useNavigation();
  function handlePress() {
    navigation.navigate('Edit User');
  }

  const SECTIONS = [
    {
      id: 'userInfoSection',
      component: <View style={styles.userInfoSection}>
          <View style={{flex: 2, width: '20%'}}>
            <Avatar.Image
              source={require('../assets/avatar.png')}
              size={85}
            />
          </View>
          <View style={{marginLeft: 20, flex: 7.5}}>
            <Text style={ {
              color: 'black',
              fontSize: 20,
              fontFamily: 'Lexend-Bold',
            }}>John Doe</Text>
            <Caption style={styles.caption}>Ireland</Caption>
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'row', flex: 1}}>
                <Text style={{
                  marginTop: 10,
                  fontSize: 18,
                  lineHeight: 14,
                  fontWeight: '500',
                  color: 'black',
                  fontFamily: 'Lexend-Bold',
                  paddingTop: 8,
                }}>1,435</Text>
                <Text style={{
                  marginTop: 10,
                  fontSize: 18,
                  lineHeight: 14,
                  fontWeight: '500',
                  color: 'black',
                  fontFamily: 'Lexend-Regular',
                  paddingTop: 8,
                }}> </Text>
                <Text style={{
                  marginTop: 10,
                  fontSize: 18,
                  lineHeight: 14,
                  fontWeight: '500',
                  color: 'black',
                  fontFamily: 'Lexend-Regular',
                  paddingTop: 8,
                }}>Followers</Text>
              </View>
              <View style={{flexDirection: 'row', flex: 1}}>
                <Text style={{
                    marginTop: 10,
                    fontSize: 18,
                    lineHeight: 14,
                    fontWeight: '500',
                    color: 'black',
                    fontFamily: 'Lexend-Bold',
                    paddingTop: 8,
                  }}>1,435</Text>
                  <Text style={{
                    marginTop: 10,
                    fontSize: 18,
                    lineHeight: 14,
                    fontWeight: '500',
                    color: 'black',
                    fontFamily: 'Lexend-Regular',
                    paddingTop: 8,
                  }}> </Text>
                  <Text style={{
                    marginTop: 10,
                    fontSize: 18,
                    lineHeight: 14,
                    fontWeight: '500',
                    color: 'black',
                    fontFamily: 'Lexend-Regular',
                    paddingTop: 8,
                  }}>Following</Text>
              </View>
            </View>
        </View>
      </View>
    },
    {
      id: 'profileButton',
      component: <View style={{width: '100%', backgroundColor: 'white', paddingHorizontal: 30, paddingBottom: 30}}>
        {/* <Button
          style={{width: '80%', marginLeft: 'auto', marginRight: 'auto'}}
          title="Learn More"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        /> */}
        <Button title="Follow" variant='contained' color="black" tintColor='white' titleStyle={{
          fontFamily: 'Lexend-Regular'
        }}/>
      </View>
    },
    {
      id: 'contentFilter',
      component: 
      <View>
        <View style={{
          width: '100%', 
          backgroundColor: 'white', 
          flexDirection: 'row', 
          borderColor: 'white', 
          paddingHorizontal: 10,
          paddingBottom: 10}}>
          <View style={{flex: 1}}></View>
          <View style={{
                flex: 4, 
                borderStyle: 'solid', 
                borderStyle: 'solid',
                borderColor: 'white',
                borderBottomColor: 'black',
                borderWidth: 5}}>
            <Text style={{
                marginTop:5 ,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: 13,
                fontFamily: 'Lexend-SemiBold',
                fontSize: 18,
                color: 'black',
              }}>Guides</Text>
          </View>
          <View style={{flex: 1}}></View>
          <View style={{
            flex: 4, 
            borderStyle: 'solid', 
            borderStyle: 'solid',
            borderColor: 'white',
            borderBottomColor: 'white',
            borderWidth: 5
            }}>
            <Text style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop:5 ,
                marginBottom: 13,
                fontFamily: 'Lexend-SemiBold',
                fontSize: 18,
                color: '#878686',
              }}>Itineraries</Text>
          </View>
          <View style={{flex: 1}}></View>
        </View>
          <TouchableOpacity><View style={{
          backgroundColor: 'black',
          height: 80,
          flexDirection: 'row',
          paddingHorizontal: 15,
          paddingTop: 15,
          marginBottom: 15,
        }}>
          <View style={{
            flex: 1
          }}>
            <Icon name="plus-circle" color="white" size={50}/>
          </View>
          <View style={{
            flex: 5
          }}>
            <Text style={{
                  marginTop: 10,
                  marginRight: 'auto',
                  fontFamily: 'Lexend-SemiBold',
                  fontSize: 18,
                  color: 'white',
                }}>Create Travel Guide</Text>
          </View>
        </View></TouchableOpacity>
      </View>
    },
    {
      id: 'testContent',
      component: <View style={{
        backgroundColor: 'white',
        borderColor: 'white',
        borderStyle: 'solid',
        borderWidth: 1,
        borderTopColor: '#f0f2f5',
        paddingTop: 15,
        paddingHorizontal: 15,
        paddingBottom: 15
      }}>
        <Image 
          source={require('../assets/dkit_campus.jpeg')}
          style={{
            flex: 1,
            width: '100%',
            height: 200,
            resizeMode: 'contain',
            borderRadius: 10
          }}
        />
        <View style={{flexDirection: 'row'}}>
          <Text style={{
              flex: 6,
              marginTop:5 ,
              marginBottom: 5,
              fontFamily: 'Lexend-SemiBold',
              fontSize: 18,
              color: 'black',
            }}>First Technological Campus in Dundalk, Louth</Text>
          <TouchableOpacity style={{flex: 1, marginTop: 3, marginLeft: 'auto'}}>
            <Icon name="play-circle" color="black" size={50}/>
          </TouchableOpacity>
        </View>
        <Text style={{
              marginTop:5,
              marginBottom: 10,
              fontFamily: 'Lexend-Regular',
              fontSize: 16,
              color: 'black',
            }}>This guide covers all about the history and the engineering culture that the institute has until now.</Text>
      </View>
    },
    {
      id: 'testContent',
      component: <View style={{
        backgroundColor: 'white',
        borderColor: 'white',
        borderStyle: 'solid',
        borderWidth: 1,
        borderTopColor: '#f0f2f5',
        paddingTop: 15,
        paddingHorizontal: 15,
        paddingBottom: 15
      }}>
        <Image 
          source={require('../assets/dkit_campus.jpeg')}
          style={{
            flex: 1,
            width: '100%',
            height: 200,
            resizeMode: 'contain',
            borderRadius: 10
          }}
        />
        <View style={{flexDirection: 'row'}}>
          <Text style={{
              flex: 6,
              marginTop:5 ,
              marginBottom: 5,
              fontFamily: 'Lexend-SemiBold',
              fontSize: 18,
              color: 'black',
            }}>First Technological Campus in Dundalk, Louth</Text>
          <TouchableOpacity style={{flex: 1, marginTop: 3, marginLeft: 'auto'}}>
            <Icon name="play-circle" color="black" size={50}/>
          </TouchableOpacity>
        </View>
        <Text style={{
              marginTop:5,
              marginBottom: 10,
              fontFamily: 'Lexend-Regular',
              fontSize: 16,
              color: 'black',
            }}>This guide covers all about the history and the engineering culture that the institute has until now.</Text>
      </View>
    },
    {
      id: 'testContent',
      component: <View style={{
        backgroundColor: 'white',
        borderColor: 'white',
        borderStyle: 'solid',
        borderWidth: 1,
        borderTopColor: '#f0f2f5',
        paddingTop: 15,
        paddingHorizontal: 15,
        paddingBottom: 15
      }}>
        <Image 
          source={require('../assets/dkit_campus.jpeg')}
          style={{
            flex: 1,
            width: '100%',
            height: 200,
            resizeMode: 'contain',
            borderRadius: 10
          }}
        />
        <View style={{flexDirection: 'row'}}>
          <Text style={{
              flex: 6,
              marginTop:5 ,
              marginBottom: 5,
              fontFamily: 'Lexend-SemiBold',
              fontSize: 18,
              color: 'black',
            }}>First Technological Campus in Dundalk, Louth</Text>
          <TouchableOpacity style={{flex: 1, marginTop: 3, marginLeft: 'auto'}}>
            <Icon name="play-circle" color="black" size={50}/>
          </TouchableOpacity>
        </View>
        <Text style={{
              marginTop:5,
              marginBottom: 10,
              fontFamily: 'Lexend-Regular',
              fontSize: 16,
              color: 'black',
            }}>This guide covers all about the history and the engineering culture that the institute has until now.</Text>
      </View>
    },
    
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfoHeader}>
          <View style={{flex: 10}}>
            <Text style={{
              marginTop:5 ,
              marginBottom: 13,
              fontFamily: 'Lexend-Bold',
              fontSize: 22,
              color: 'black',
            }}>superawesome433</Text>
          </View>
      </View>
      <FlatList
        data={SECTIONS}
        renderItem={({item}) => item.component}
        keyExtractor={item => item.id}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode='never'
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[2]}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      flex: 1
    },
    userInfoHeader: {
      paddingHorizontal: 20,
      backgroundColor: 'white',
      flexDirection: 'row',
      paddingTop: 10,
      paddingBottom: 15,
    },
    userInfoSection: {
      paddingLeft: 15,
      paddingRight: 5,
      backgroundColor: 'white',
      shadowColor: 'black',
      shadowOffset: {
        width: 10,
        height: 10,
      },
      shadowOpacity: 0.5,
      shadowRadius: 3,
      flexDirection: 'row',
      paddingBottom: 20,
    },
    // userInfoSection: {
    //   paddingHorizontal: 30,
    //   marginBottom: 25,
    //   marginTop: 10,
    //   backgroundColor: 'white',
    // },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      borderStyle: 'solid',
      borderColor: 'black',
      fontFamily: 'Lexend-ExtraLight',
    },
    caption: {
      paddingTop: 10,
      fontSize: 15,
      lineHeight: 14,
      fontWeight: '500',
      color: 'black',
      fontFamily: 'Lexend-Regular',
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