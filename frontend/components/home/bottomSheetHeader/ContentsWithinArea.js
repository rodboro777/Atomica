import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator, Text} from 'react-native';

export default function ContentsWithinAreaHeader({
    currentPage,
    locationsWithinFrame
}) {
    const [isLoading, setLoading] = useState(true);
    const PAGE_TYPE = {
        GUIDES: 'guides',
        ITINERARIES: 'itineraries'
    };

    const [title, setTitle] = useState('');

    useEffect(() => {
        setLoading(true);
        
        // based on the current page, count the number of contents.
        let memo = new Set();
        let total = 0;
        Object.keys(locationsWithinFrame).forEach(placeId => {
          let contents = [];
          if (currentPage == PAGE_TYPE.GUIDES) {
            contents = locationsWithinFrame[placeId].travelGuides;
          } else {
            contents = locationsWithinFrame[placeId].itineraries;
          }
  
          if (contents) {
            for (let i = 0; i < contents.length; i++) {
              let content = contents[i];
              if (!(content._id in memo)) {
                memo.add(content._id);
                total += 1;
              }
            }
          }
        });
  
        if (currentPage == PAGE_TYPE.GUIDES) {
          setTitle(`${total} travel guides in this area`);
        } else {
          setTitle(`${total} itineraries in this area`);
        }
  
        setLoading(false);
    }, [locationsWithinFrame, currentPage]);

    return (
        <>
        {isLoading ? 
            <ActivityIndicator 
              size="large" color="black"
              style={{
                marginTop: 15
              }}
            /> : 
            <Text style={{
              fontFamily: 'Lexend-SemiBold',
              fontSize: 16,
              color: 'black',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 15,
              textAlign: 'center'
            }}>{title}</Text>}
        </>
    )
}