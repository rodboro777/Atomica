import { View, SafeAreaView, StyleSheet, FlatList, Image, TouchableOpacity, Text } from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import { Button } from "@react-native-material/core";
  
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ContentFilter({
  currentPage,
  setCurrentPage
}) {
    const PAGE_TYPE = {
      GUIDES: 'guides',
      ITINERARIES: 'itineraries',
      APPLICATIONS: 'applications'
    };
    return (
        <View>
          <View style={{
            width: '100%', 
            backgroundColor: 'white', 
            flexDirection: 'row', 
            paddingHorizontal: 10,
            paddingBottom: 0}}>
            <View style={{flex: 1}}></View>
            <TouchableOpacity 
              style={{
                  flex: 4, 
                  borderStyle: 'solid',
                  borderColor: 'white',
                  borderBottomColor: currentPage == PAGE_TYPE.GUIDES ? "black" : 'white',
                  borderWidth: 1
                }}
              activeOpacity={0.6}
              onPress={() => setCurrentPage(PAGE_TYPE.GUIDES)}
            >
              <Text style={{
                  marginTop:5 ,
                  marginBottom: 10,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  fontFamily: 'Lexend-SemiBold',
                  fontSize: 18,
                  color: currentPage == PAGE_TYPE.GUIDES ? "black" : '#878686',
                }}>Guides</Text>
            </TouchableOpacity>
            <View style={{flex: 1}}></View>
            <TouchableOpacity style={{
              flex: 4, 
              borderStyle: 'solid',
              borderColor: 'white',
              borderBottomColor: currentPage == PAGE_TYPE.ITINERARIES ? "black" : 'white',
              borderWidth: 1
              }}
              onPress={() => setCurrentPage(PAGE_TYPE.ITINERARIES)}
              activeOpacity={0.6}
              >
              <Text style={{
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginTop:5 ,
                  marginBottom: 10,
                  fontFamily: 'Lexend-SemiBold',
                  fontSize: 18,
                  color: currentPage == PAGE_TYPE.ITINERARIES ? "black" : '#878686',
                }}>Itineraries</Text>
            </TouchableOpacity>
            <View style={{flex: 1}}></View>
          </View>
        </View>
    )
}