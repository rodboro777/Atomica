import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native'
import React, { useRef } from 'react';
import {useNavigation} from '@react-navigation/native'
const {width, height} = Dimensions.get('window');

const Oindex = props => {
    const navigation = useNavigation();
    const ref = React.useRef();


    const [screens, setScreens] = React.useState(0);

    const onViewableItemsChaged = ({
        viewableItems,
    }) => {
        setScreens(viewableItems[0].key + 1);
    };

    const viewabilityConfigCallbackPairs = useRef([
        {onViewableItemsChaged},
    ]);


    const slides = [
        {
            id: 1,
            title: 'Get Off Track',
            subtitle: 'NEVER WONDER AGAIN',
            description: `Experience world's best adventure with us`,
            imagePath: require('../../assets/1.png'),
        },
        {
            id: 2,
            title: 'Rare Destinations',
            subtitle: `SEE WORLD'S BEST`,
            description: `Challenge yourself amongst world's breathtaking views`,
            imagePath: require('../../assets/2.png'),
        },
        {
            id: 3,
            title: 'Pocket Itinerary',
            subtitle: 'STEP BY STEP',
            description: `So you can focus what's most important`,
            imagePath: require('../../assets/3.png'),
        },
    ]


    const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  return (
    <View style={styles.container}>
        <View style={styles.top}>
            <FlatList
                data={slides}
                horizontal={true}
                key={({item}) => {item.id}}
                showsHorizontalScrollIndicator={false}
                pagingEnabled={true}
                viewabilityConfigCallbackPairs={
                    viewabilityConfigCallbackPairs.current
                }
                renderItem={({item}) => {
                    return(
                        <View style={styles.item}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.subtitle}>{item.subtitle}</Text>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.description}>{item.description}</Text>
                            </View>
                            <Image style={styles.image} source={item.imagePath}/>
                            
                        </View>    
                    )
                }}
            />
            {/* <View style={styles.row}>
                <View style={[styles.dot, {backgroundColor: screens === 0 ? '#f52d56': '#fff'}]}/>
                <View style={[styles.dot, {backgroundColor: screens === 1 ? '#f52d56': '#fff'}]}/>
                <View style={[styles.dot, {backgroundColor: screens === 2 ? '#f52d56': '#fff'}]}/>
            </View> */}
        </View>

        <View style={styles.bottom}>
        <TouchableOpacity style={styles.buttonFloating} onPress={() => props.navigation.navigate('Home')}>
            <Text style={styles.buttonFloatingText}>SKIP</Text>
        </TouchableOpacity>
        </View>

    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0d243c',
    },
    top: {
        flex: 1,
        backgroundColor: '#EBEBEB',
    },
    row :{
        flexDirection: 'row',
        position: 'absolute',
        right: 0,
        left: 0,
        bottom: 8,
        justifyContent: 'center'
    },
    dot: {
        width: 12,
        height: 12,
        backgroundColor: '#EBEBEB',
        borderRadius: 50,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#EBEBEB'
    },
    bottom: {
        flex: 0,
        flexDirection: 'row'
    },
    button: {
        backgroundColor: '#EBEBEB',
        padding: 20,
        marginHorizontal: 20,
        marginVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    buttonOutline: {
        borderWidth: 1,
        borderColor: '#EBEBEB',
        padding: 20,
        marginHorizontal: 20,
        marginVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        fontWeight: 'bold',
        color: '#0d243c',
        fontSize: 15
    },
    image: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width,
    },
    item: {
        width: Dimensions.get('window').width,
        justifyContent: 'flex-end',
        //height: Dimensions.get('window').height
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20
    },
    title: {
        color: '#0d243c',
        fontWeight: 'bold',
        fontSize: 22,
    },
    subtitle: {
        color: '#f52d56',
        fontWeight: 'bold',
        fontSize: 12,
        paddingBottom: 15
    },
    description: {
        color: '#0d243c',
        fontSize: 14,
        textAlign:'center',
        paddingTop: 5
    },
    buttonFloating: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 130,
        height: 60,
        borderRadius: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonFloatingText: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
      },
});

export default Oindex;