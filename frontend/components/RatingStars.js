import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

export default function RatingStars(props) {
  const {setRatingValue, ratingValue, submitting, submitReview} = props;

  const styles = StyleSheet.create({
    ratingStarsHolder: {
      flexDirection: 'row',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '35%',
      marginRight: 'auto',
      marginLeft: 'auto',
      marginTop: 20,
    },
    ratingStars: {
      fontSize: 30,
      color: 'yellow',
    },
    submitBtn: {
      position: 'absolute',
      bottom: -100,
      padding: 10,
      backgroundColor: 'white',
      borderRadius: 25,
      width: 150,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      left: '30%',
      transform: [{translateX: -50}],
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    submitBtnText: {
      color: 'black',
      fontWeight: '700',
      fontSize: 20,
      letterSpacing: 2,
      fontFamily:'Lexend-ExtraLight',
    },
  });

  return (
    <View style={styles.ratingStarsHolder}>
      <Pressable
        key={1}
        onPress={() => {
          setRatingValue(1);
        }}>
        <Text style={styles.ratingStars}>{ratingValue >= 1 ? '★' : '✰'}</Text>
      </Pressable>
      <Pressable
        key={2}
        onPress={() => {
          setRatingValue(2);
        }}>
        <Text style={styles.ratingStars}>{ratingValue >= 2 ? '★' : '✰'}</Text>
      </Pressable>
      <Pressable
        key={3}
        onPress={() => {
          setRatingValue(3);
        }}>
        <Text style={styles.ratingStars}>{ratingValue >= 3 ? '★' : '✰'}</Text>
      </Pressable>
      <Pressable
        key={4}
        onPress={() => {
          setRatingValue(4);
        }}>
        <Text style={styles.ratingStars}>{ratingValue >= 4 ? '★' : '✰'}</Text>
      </Pressable>
      <Pressable
        key={5}
        onPress={() => {
          setRatingValue(5);
        }}>
        <Text style={styles.ratingStars}>{ratingValue >= 5 ? '★' : '✰'}</Text>
      </Pressable>
      <TouchableOpacity
        style={styles.submitBtn}
        onPress={submitReview}
        disabled={submitting ? true : false}>
        {submitting ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <Text style={styles.submitBtnText}>Submit</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
