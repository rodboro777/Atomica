import React from 'react';
import {View, Text, StyleSheet, Dimensions, ScrollView} from 'react-native';
import {Skeleton} from '@rneui/themed';

export default function SkeletonLoader(props) {
  const styles = StyleSheet.create({
    skeletonHolder: {
      height: '100%',
      padding: 10,
    },
    skeletonHeader: {
      flexDirection: 'row',
      width: '55%',
      justifyContent: 'space-between',
      display: 'flex',
      alignItems: 'center',
    },
    skeletonImage: {
      marginTop: 5,
    },
    skeletonDesc: {
      marginTop: 5,
    },
  });

  return (
    <View style={styles.skeletonHolder}>
      <View style={styles.skeletonHeader}>
        <Skeleton circle width={40} height={40} animation="pulse" />
        <Skeleton width={150} height={30} animation="pulse" />
      </View>
      <View style={styles.skeletonImage}>
        <Skeleton
          width={'100%'}
          height={200}
          style={{borderRadius: 10}}
          animation="pulse"
        />
      </View>
      <Skeleton
        width={250}
        height={30}
        style={styles.skeletonDesc}
        animation="pulse"
      />
      <Skeleton
        width={200}
        height={30}
        style={styles.skeletonDesc}
        animation="pulse"
      />
      <Skeleton
        width={100}
        height={30}
        style={styles.skeletonDesc}
        animation="pulse"
      />
      <Skeleton
        width={280}
        height={30}
        style={styles.skeletonDesc}
        animation="pulse"
      />
    </View>
  );
}
