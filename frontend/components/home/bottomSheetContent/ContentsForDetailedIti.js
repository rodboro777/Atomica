import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Dimensions} from 'react-native';
import axios from 'axios';
import ip from '../../../ip.json';
import TravelGuide from '../../TravelGuide';
import SoundPlayer from 'react-native-sound-player';
import SkeletonLoader from '../../SkeletonLoader';

export default function ContentsForDetailedIti(props) {
  const {
    selectedItinerary,
    navigation,
    setTgMarkers,
    mapRef,
    setRunningIds,
    setItiTg,
    handleUpOverScrollModal,
    activateTravelGuideNav
  } = props;

  const [travelGuides, setTravelGuides] = useState(null);
  const [currentPlayingTG, setCurrentPlayingTG] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const data = [{_id: 1}];

  useEffect(() => {
    const fetchTravelGuides = async () => {
      const response = await axios.post(
        `http://${ip.ip}:8000/travelGuide/byIds`,
        selectedItinerary.travelGuideId,
      );
      const tgs = response.data.travelGuides;
      setTravelGuides(tgs);
      const ids = [];
      const coordinates = [];
      tgs.map(tg => {
        ids.push(`place_id:${tg.placeId}`);
        coordinates.push({
          latitude: tg.coordinates.lat,
          longitude: tg.coordinates.lng,
        });
        setTgMarkers(prev => {
          return [
            ...prev,
            {
              id: tg._id,
              latitude: tg.coordinates.lat,
              longitude: tg.coordinates.lng,
            },
          ];
        });
      });
      setRunningIds(ids);
      setItiTg(tgs);
      setIsLoading(false);
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
        animated: true,
      });
    };
    fetchTravelGuides();
  }, []);

  useEffect(() => {
    SoundPlayer.addEventListener('FinishedPlaying', () => {
      setCurrentPlayingTG(null);
    });
  }, []);

  const renderItem = ({item}) => {
    return isLoading ? (
      <SkeletonLoader />
    ) : (
      <TravelGuide
        currentPlayingTG={currentPlayingTG}
        setCurrentPlayingTG={setCurrentPlayingTG}
        navigation={navigation}
        travelGuide={item}
        closeCurrentModal={handleUpOverScrollModal}
        activateTravelGuideNav={activateTravelGuideNav}
        enableTravelGuideNav={false}
      />
    );
  };

  return (
    <>
      {travelGuides && (
        <FlatList
          data={isLoading ? data : travelGuides}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
        />
      )}
    </>
  );
}
