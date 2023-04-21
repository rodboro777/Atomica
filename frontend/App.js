import React, {useEffect, useState} from 'react';
import {Image, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SignUp from './screens/SignUp';
import Login from './screens/Login';
import Map from './screens/Map';
import NewMap from './screens/NewMap';
import Library from './screens/Library';
import PlacesAutoComplete from './components/PlacesAutoComplete';
import CreateItinerary from './screens/CreateItinerary';
import CreateTravelGuide from './screens/CreateTravelGuide';
import User from './screens/User';
import EditUser from './screens/EditUser';
import Oindex from './screens/onBoarding/Oindex';
import ip from './ip';
import {withNavigation} from '@react-navigation/compat';
import Test from './screens/Test';

navigator.geolocation = require('@react-native-community/geolocation');

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const UserWithNavigation = withNavigation(User);

function MyTabs() {
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    fetch(`http://${ip.ip}:8000/auth/isLoggedIn`, {
      credentials: 'include',
      method: 'GET',
    })
      .then(res => res.json())
      .then(resBody => {
        if (resBody.userId) {
          setUserId(resBody.userId);
          setIsLoggedIn(true);
        }
      });
  }, []);
  return (
    <Tab.Navigator
      initialRouteName=""
      screenOptions={{
        tabBarItemStyle: {
          backgroundColor: '#000',
          margin: 0,
          borderRadius: 0,
        },
        tabBarLabelStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Tab.Screen
        name="Home"
        options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: tabInfo => {
            return (
              <Image
                source={require('./assets/home.png')}
                style={styles.mapicon}
              />
            );
          },
        }}>
        {props => {
          return <HomeScreen {...props} userId={userId} />;
        }}
      </Tab.Screen>
      <Tab.Screen
        name="Search"
        component={SearchStack}
        options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: tabInfo => {
            return (
              <Image
                source={require('./assets/search.png')}
                style={styles.mapicon}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="UserProfile"
        options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: tabInfo => {
            return (
              <Image
                source={require('./assets/user.png')}
                style={styles.mapicon}
              />
            );
          },
        }}>
        {props => {
          return <UStackNav {...props} 
            ownerId={userId}
            origin="Tab"
          />;
        }}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const HomeScreen = passedProps => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Map" options={{headerShown: false}}>
        {props => {
          return <NewMap {...props} {...passedProps} />;
        }}
      </Stack.Screen>
      <Stack.Screen name="UserProfileFromHome" options={{headerShown: false}}>
        {(props) => {
          return <User 
            {...props}
            {...passedProps}
            origin='Home'
            ownerId={props.route.params.ownerId}
          />
        }}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const UStackNav = passedProps => {
  return (
    <Stack.Navigator initialRouteName="User">
      <Stack.Screen name="User" options={{headerShown: false}}>
        {props => {
          console.log(props);
          return (
            <UserWithNavigation
              {...passedProps}
              {...props}
            />
          );
        }}
      </Stack.Screen>
      <Stack.Screen
        name="Edit User"
        component={EditUser}
        options={{
          headerTitleStyle: {fontFamily: 'Lexend-SemiBold'},
        }}
      />
      <Stack.Screen
        name="Create Itinerary"
        component={CreateItinerary}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Create TravelGuide"
        component={CreateTravelGuide}
        options={{headerShown: false}}
      />
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

const App = props => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
      <Stack.Screen
          name="Onboarding"
          component={Test}
          options={{headerShown: false}}
        />
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
        <Stack.Screen
          name="User"
          component={User}
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
