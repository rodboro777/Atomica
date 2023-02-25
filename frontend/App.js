import React, {useEffect, useState} from 'react';
import {Image, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SignUp from './screens/SignUp';
import Login from './screens/Login';
import Map from './screens/Map';
import Library from './screens/Library';
import PlacesAutoComplete from './components/PlacesAutoComplete';
import CreateItinerary from './screens/CreateItinerary';
import CreateTravelGuide from './screens/CreateTravelGuide';
import EditItinerary from './screens/EditItinerary';
import EditTravelGuide from './screens/CreateTravelGuide';
import User from './screens/User';
import EditUser from './screens/EditUser';
import ip from './ip';

navigator.geolocation = require('@react-native-community/geolocation');

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetch(`http://${ip.ip}:8000/auth/isLoggedIn`, {
      credentials: 'include',
      method: 'GET',
    })
    .then(res => res.json())
    .then(resBody => {
      if (resBody.userId) {
        setUserId(resBody.userId);
      }
    })
  }, [])
  return (
    <Tab.Navigator initialRouteName="" screenOptions={{tabBarItemStyle:{
      backgroundColor:'#000',
      margin:0,
      borderRadius:0,
    }, tabBarLabelStyle: {
      fontWeight: "bold"
    }}}>
      <Tab.Screen name="Home" component={Map} options={{ headerShown: false, tabBarLabel: "", tabBarIcon: (tabInfo) => {
        return (
         <Image 
          source={require("./assets/home.png")}
          style={styles.mapicon}
         />
        )
      }}}/>
      <Tab.Screen name="Search" component={SearchStack} options={{headerShown: false ,tabBarLabel: "", tabBarIcon: (tabInfo) => {
        return (
         <Image 
          source={require("./assets/search.png")}
          style={styles.mapicon}
         />
        )
      }}}/>
      <Tab.Screen name="Library" component={LStackNav} options={{ headerShown: false,tabBarLabel: "", tabBarIcon: (tabInfo) => {
        return (
         <Image 
          source={require("./assets/menu.png")}
          style={styles.mapicon}
         />
        )
      } }}/>
      <Tab.Screen name="UserProfile" options={{ 
        headerShown: false, 
        tabBarLabel: "",
        params: {
          userId: 'hahaha'
        },
        tabBarIcon: (tabInfo) => {
         return (
               <Image
                source={require("./assets/user.png")}
                style={styles.mapicon}
               />
              )
      } }}>
        {(props) => {
          return <UStackNav 
            {...props}
            ownerId={userId}
          />
        }}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const UStackNav = (passedProps) => {
  return(
    <Stack.Navigator initialRouteName='User'>
      <Stack.Screen name='User' options={{ headerShown: false }}>
        {(props) => {
          return <User {...props} {...passedProps}/>
        }}
      </Stack.Screen>
      <Stack.Screen name='Edit User' component={EditUser} options={{
        headerTitleStyle: {fontFamily: 'Lexend-SemiBold'}
      }}/>
    </Stack.Navigator>
  )
}

const LStackNav = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Lib"
        component={Library}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Create Itinerary"
        component={CreateItinerary}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Create TravelGuide" component={CreateTravelGuide} />
    </Stack.Navigator>
  );
};

const SearchStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchPlaces"
        component={PlacesAutoComplete}
        options={{headerShown: false}}
      />
      <Stack.Screen name="CItinerary" component={CreateItinerary} />
    </Stack.Navigator>
  );
};

// const App = () => {
//   return (

//     <NavigationContainer>
//        <Stack.Navigator initialRouteName="Login">
//         <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
//         <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
//         <Stack.Screen name="Map" component={Map} options={{ headerShown: false }} />

//       </Stack.Navigator>
//        <MyTabs />

//     </NavigationContainer>
//   );
// };

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MyTabs"
          component={MyTabs}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  mapicon: {
    height: 30,
    width: 30,
    marginTop: 20,
  },
});
