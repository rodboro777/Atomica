import {
    View,
    SafeAreaView,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Text,
    Alert,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ip from '../ip.json';
import TravelGuide from '../components/TravelGuide';
import UserInfoSection from '../components/UserInfoSection';
import ContentFilter from '../components/ContentFilter';
import SoundPlayer from 'react-native-sound-player';
import { useIsFocused } from '@react-navigation/native';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';

export default function AddTravelGuides({ navigation, origin, route }) {
    const isFocused = useIsFocused();
    bs = React.createRef();
    fall = new Animated.Value(1);
    ownerId = route.params.ownerId;
    renderInner = () => (
        <View style={styles.panel}>
            <View style={{ alignItems: 'center' }}>
                <Text style={styles.panelTitle}>Create Content</Text>
            </View>

            <TouchableOpacity
                style={styles.panelButton}
                onPress={() => this.bs.current.snapTo(1)}>
                <Text style={styles.panelButtonTitle}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );

    useEffect(() => {
        console.log('Travel Guide Created');
        console.log(route);
        this.bs.current.snapTo(1);

    }, [isFocused]);

    const [ownerInfo, setOwnerInfo] = useState({
        id: ownerId,
        fullName: '',
        country: '',
    });
    const [userId, setUserId] = useState(null);
    const [followInfo, setFollowInfo] = useState({
        numOfFollowers: 0,
        numOfFollowing: 0,
    });

    const [travelGuides, setTravelGuides] = useState([]);
    const [itineraries, setItineraries] = useState([]);
    const [applications, setApplications] = useState([]);

    // Only use this when ownerId != userId
    const [isFollowing, setFollowing] = useState(false);

    const PAGE_TYPE = {
        GUIDES: 'guides',
        ITINERARIES: 'itineraries',
        APPLICATIONS: 'applications',
    };
    const [currentPage, setCurrentPage] = useState(PAGE_TYPE.GUIDES);
    const [contentList, setContentList] = useState([]);
    const [currentPlayingTG, setCurrentPlayingTG] = useState(null);


    const preparePageData = () => {
        // Authenticate user.
        fetch(`http://${ip.ip}:8000/auth/isLoggedIn`, {
            credentials: 'include',
            method: 'GET',
        })
            .then(res => res.json())
            .then(resBody => {
                if (!resBody.isLoggedIn) {
                    navigation.navigate('Home');
                }
                setUserId(resBody.userId);
            });

        // Get User info of the owner (fullname, country)
        fetch(`http://${ip.ip}:8000/user/info?id=${ownerId}`, {
            credentials: 'include',
            method: 'GET',
        })
            .then(res => res.json())
            .then(resBody => {
                if (resBody.statusCode == 200) {
                    setOwnerInfo({
                        ...ownerInfo,
                        fullName: resBody.info.firstName + ' ' + resBody.info.lastName,
                        country: resBody.info.country,
                        username: resBody.info.username,
                        imageUrl: resBody.info.imageUrl,
                    });
                } else {
                    navigation.navigate('MyTabs');
                }
            });

        // Get the travel guides created by the owner.
        fetch(`http://${ip.ip}:8000/travelGuide/byCreator?creatorId=${ownerId}`, {
            credentials: 'include',
            method: 'GET',
        })
            .then(res => res.json())
            .then(resBody => {
                if (resBody.statusCode == 200) {
                    setTravelGuides(resBody.travelGuides);
                    setApplications([
                        ...resBody.pendingTravelGuides,
                        ...resBody.rejectedTravelGuides,
                    ]);
                }
            });

    }


    useEffect(() => {
        preparePageData();
    }, [isFocused]);

    useFocusEffect(
        React.useCallback(() => {
            preparePageData();
        }, [])
    );

    useEffect(() => {
        if (userId && userId != ownerId) {
            console.log("just a log")
            fetch(
                `http://${ip.ip}:8000/follow/isFollowing?followerId=${userId}&followedId=${ownerId}`,
                {
                    credentials: 'include',
                    method: 'GET',
                },
            )
                .then(res => res.json())
                .then(resBody => {
                    if (resBody.statusCode == 200) {
                        setFollowing(resBody.isFollowing);
                    }
                });
        }
    }, [userId]);

    useEffect(() => {
        let candidateList = [...PRIMARY_SECTIONS];
        if (currentPage == PAGE_TYPE.GUIDES) {
            travelGuides.forEach(travelGuide => {
                candidateList.push({
                    id: travelGuide._id,
                    type: 'travelGuide',
                    travelGuide: travelGuide,
                });
            });
        }
        setContentList(candidateList);
    }, [
        travelGuides,
        currentPage,
    ]);

    useEffect(() => {
        setCurrentPlayingTG(null);
    }, [currentPage]);

    useEffect(() => {
        SoundPlayer.addEventListener('FinishedPlaying', () => {
            setCurrentPlayingTG(null);
        });
    }, []);
    const [selectedItems, setSelectedItems] = useState([]);

    function renderItem({ item }) {

        let isSelected = selectedItems.includes(item.id);

        function handleItemPress() {
            if (isSelected) {

                setSelectedItems(selectedItems.filter(id => id !== item.id));
            } else {

                setSelectedItems([...selectedItems, item.id]);
            }
        }

        if (item.type == 'profileButton') {
            return (
                <View
                    style={{
                        width: '100%',
                        backgroundColor: 'white',
                        paddingHorizontal: 30,
                        paddingBottom: 30,
                    }}>

                </View>
            );
        } else if (item.type == 'travelGuide') {
            return (
                <TouchableOpacity
                    style={{
                        marginBottom: 10,
                        width: '50%',
                    }}
                    onPress={handleItemPress}>
                    {isSelected && (
                        <View
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                zIndex: 1,
                                width: '100%',

                            }}
                        />

                    )}

                    <TravelGuide
                        travelGuide={item.travelGuide}
                        isUserProfilePage={true}
                        navigation={navigation}
                        addTravelGuide={true}
                    />
                </TouchableOpacity>
            );
        }
    }

    const PRIMARY_SECTIONS = [
        {
            id: 'userInfoSection',
            type: 'userInfoSection',
        },

        {
            id: 'contentFilter',
            type: 'contentFilter',
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {contentList.length >= 3 && (
                <>
                    <View style={styles.userInfoHeader}>
                        {origin == 'Home' && (
                            <TouchableOpacity
                                style={{
                                    flex: 1.5,
                                }}
                                onPress={() => {
                                    navigation.navigate('Map');
                                }}>
                                <Icon
                                    name="keyboard-backspace"
                                    color="black"
                                    size={30}
                                    style={{
                                        marginTop: 'auto',
                                        marginBottom: 'auto',
                                    }}
                                />
                            </TouchableOpacity>
                        )}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>

                            <TouchableOpacity onPress={() => navigation.navigate('Create Itinerary', { item: {}, isEdit: false, ownerId: ownerId })}>
                                <Icon
                                    name="arrow-left"
                                    color="black"
                                    size={40}
                                    style={{
                                        marginTop: 16,
                                        marginBottom: 15,
                                        marginRight: 10,
                                    }}
                                />
                            </TouchableOpacity>
                            {selectedItems.length > 0 && (
                                <TouchableOpacity onPress={() => navigation.navigate('Create Itinerary', { item: {}, isEdit: false, ownerId: ownerId, selectedItems: selectedItems })}>
                                    <Icon
                                        name="import"
                                        color="green"
                                        size={40}
                                        style={{
                                            marginTop: 14,
                                            marginBottom: 15,
                                            marginLeft: 20,
                                        }}
                                    />
                                </TouchableOpacity>
                            )}

                        </View>
                        <Text
                            style={{
                                marginTop: 15,
                                marginBottom: 13,
                                fontFamily: 'Cereal_bold',
                                fontSize: 22,
                                color: 'black',
                            }}>
                            {ownerInfo.username + "'s Travel Guides"}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                        <TouchableOpacity onPress={() => setSelectedItems([])}>
                            {selectedItems.length > 0 && (
                                <Text style={{ marginLeft: 9, color: 'red', fontFamily: 'Cereal_bold', fontSize: 18 }}>Clear Selection</Text>
                            )}
                        </TouchableOpacity>
                        <Text style={{ marginRight: 9, color: 'black', fontFamily: 'Cereal_bold', fontSize: 18 }}>{selectedItems.length} selected</Text>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', flexGrow: 0 }}>
                        <FlatList
                            data={contentList}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            bounces={false}
                            alwaysBounceVertical={false}
                            overScrollMode="never"
                            showsVerticalScrollIndicator={false}
                            numColumns={2}
                        />
                    </View>

                </>
            )
            }
            <BottomSheet
                ref={this.bs}
                snapPoints={[260, 0]}
                renderContent={this.renderInner}
                initialSnap={1}
                callbackNode={this.fall}
                enabledGestureInteraction={true}
            />
            <Animated.View
                style={{
                    margin: 0,
                    opacity: Animated.add(0.1, Animated.multiply(this.fall, 1.0)),
                }}></Animated.View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        width: '100%',
    },
    userInfoHeader: {
        paddingHorizontal: 20,
        backgroundColor: 'white',
        flexDirection: 'column',
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
    },
    panel: {
        padding: 20,
        backgroundColor: '#f0f2f5',
    },
    panelHeader: {
        alignItems: 'center',
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
    },
    panelTitle: {
        fontSize: 27,
        height: 35,
        fontFamily: 'Lexend-Bold',
        color: 'black',
    },
    panelSubtitle: {
        fontSize: 14,
        color: 'black',
        height: 30,
        marginBottom: 10,
        fontFamily: 'Lexend-Regular',
    },
    panelButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: 'black',
        alignItems: 'center',
        marginVertical: 7,
        fontFamily: 'Lexend-Regular',
    },
    panelButtonTitle: {
        fontSize: 17,
        fontFamily: 'Lexend-Regular',
        color: 'white',
    },

});
