import { View, SafeAreaView, StyleSheet, FlatList, Image, TouchableOpacity, Text } from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import { Button } from "@react-native-material/core";
  
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    Avatar,
    Title,
    Caption,
    TouchableRipple,
  } from 'react-native-paper';

export default function UserInfoSection({
    ownerInfo,
    followInfo,
}) {
    return (
        <View style={styles.userInfoSection}>
            <View style={{flex: 2, width: '20%'}}>
            <Avatar.Image
                source={{uri: ownerInfo.imageUrl}}
                size={85}
            />
            </View>
            <View style={{marginLeft: 20, flex: 7.5}}>
            <Text style={ {
                color: 'black',
                fontSize: 20,
                fontFamily: 'Lexend-Bold',
                marginTop: ownerInfo.country ? 0 : 10,
                marginBottom: ownerInfo.country? 0 : 5
            }}>{ownerInfo.fullName}</Text>
            {ownerInfo.country && <Caption style={styles.caption}>{ownerInfo.country}</Caption>}
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
                }}>{followInfo.numOfFollowers}</Text>
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
                    }}>{followInfo.numOfFollowing}</Text>
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
    )
}

const styles = StyleSheet.create({
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
    caption: {
      paddingTop: 10,
      fontSize: 15,
      lineHeight: 14,
      fontWeight: '500',
      color: 'black',
      fontFamily: 'Lexend-Regular',
    },
});