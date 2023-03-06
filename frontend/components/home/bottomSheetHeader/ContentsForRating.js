import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function ContentsForRating(props) {
  const styles = StyleSheet.create({
    center: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      width:"100%",
      marginTop:20,
    },
  });
  return (
    <View style={styles.center}>
      <View style={{padding: 10, width: '100%'}}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 20,
            color: 'black',
            letterSpacing: 5,
            fontFamily: 'Lexend-Regular',
          }}>
          Please Rate Your Experience
        </Text>
      </View>
    </View>
  );
}
