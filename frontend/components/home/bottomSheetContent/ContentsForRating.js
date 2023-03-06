import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import RatingStars from '../../RatingStars';

export default function ContentsForRating(props) {
  const {setRatingValue, ratingValue, submitting, submitReview} = props;
  return (
    <View style={{
        height:Dimensions.get('window').height,
    }}>
      <RatingStars
        setRatingValue={setRatingValue}
        ratingValue={ratingValue}
        submitting={submitting}
        submitReview={submitReview}
      />
    </View>
  );
}
