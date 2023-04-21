import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, SafeAreaView, Alert, Dimensions } from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import ip from '../ip';
import Inputs from '../components/Inputs';
import Submit from '../components/Submit';
import Account from '../components/Account';

const { width } = Dimensions.get('window');
const imageWidth = width * 0.8;

const Test = props => {
  const [authorizedGeolocation, setAuthorizedGeolocation] = useState(false);
  Geolocation.requestAuthorization(
    () => {
      setAuthorizedGeolocation(true);
    },
    (err) => {
      Alert.alert('Failed to get geolocation permission. Guidify needs geolocation permission to run.');
    }
  );
  React.useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '477719873582-gonl6flm7625haa8nrm3uf1219vcgiaq.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState("");
  const [passwd, setPasswd] = useState('');
  const [passwdRepeat, setPasswdRepeat] = useState("");
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");

  const registerLocal = async () => {

    fetch(`http://10.0.2.2:8000/auth/register`, {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: passwd,
            fullName: fullName,
            country: country,
        })

    })
        .then(res => res.json())
        .then(resBody => {
            if (resBody.statusCode == 200) {
                props.navigation.navigate('MyTabs');
            } else {
                // TODO: need a UI to handle failed registration.
                console.log("Registration failed");
            }
        })
        .catch(err => console.log(err));
};

  return (
    <SafeAreaView>
    <View style={{
        paddingTop: 30 
    }}>
        <View style={{alignItems: 'center'}}>
            <Text style={{ fontSize: 35, color: 'blue', fontFamily: 'Lexend-Bold', marginVertical: 3}}>
            Let's Get Started
            </Text>
            <Text style={{fontFamily: 'Lexend-Bold', fontSize: 20, maxWidth: '60%', textAlign: 'center', color: '#000', marginTop: 15}}>
            Create an account to access all features
            </Text>
        </View>

        <View style={{marginVertical: 30, justifyContent: 'center', alignItems: 'center'}}>
                <Inputs name="Full name" icon="user" onChangeText={(fullName) => setFullName(fullName)} />
                <Inputs name="Username" icon="user" onChangeText={(username) => setUsername(username)} />
                <Inputs name="Country" icon="map-pin" onChangeText={(country) => setCountry(country)} />
                <Inputs name="Password" icon="lock" pass={true} onChangeText={(passwd) => setPasswd(passwd)} />
                <Inputs name="Confirm Password" icon="lock" pass={true} onChangeText={(passwdRepeat) => setPasswdRepeat(passwdRepeat)} />
        <View style={{ marginTop: 10, marginBottom: 10 }}/>
        <Submit title="Sign Up" color="black" handleSubmit={registerLocal} />  
        <View style={{ flexDirection: 'row', marginVertical: 15 }}>
          <Text style={[styles.textBody, {}]}>Already have an account?</Text>
          <Text
            style={[styles.textBody, { color: 'black' }]}
            onPress={() => props.navigation.navigate('Home')}>
            {' '}
            Sign In
          </Text>
        </View>  
        </View>
      </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  image: {
    width: imageWidth,
    height: imageWidth * 0.75, // adjust the aspect ratio as needed
    marginVertical: 10,
  },
  textTitle: {
    fontFamily: 'Lexend-ExtraLight',
    fontSize: 40,
    marginVertical: 10,
    color: 'black',
    fontWeight: 'bold',
  },
  textBody: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: 16,
  },
});

export default Test;
