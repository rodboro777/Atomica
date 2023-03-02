import React, {useState} from 'react';
import {View, StyleSheet, Text, Image, ScrollView, Alert} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Geolocation from '@react-native-community/geolocation';
import {useNavigation} from '@react-navigation/native';
import ip from '../ip';

import Inputs from '../components/Inputs';
import Submit from '../components/Submit';
import Account from '../components/Account';

const Login = props => {
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
        '126517507975-hkmu5h3t306dnfjq4p6ppu1ogd8v2ilg.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState("");
  const [passwd, setPasswd] = useState('');

  const localSignIn = () => {
    fetch(`http://${ip.ip}:8000/auth/login`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: passwd,
      }),
    })
      .then(res => res.json())
      .then(resBody => {
        if (resBody.statusCode == 200) {
          props.navigation.navigate('MyTabs');
        } else if (resBody.statusCode == 403) {
          // TODO user entered the wrong credentials. add a UI for this.
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      fetch(`http://${ip.ip}:8000/auth/google`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serverAuthCode: userInfo.serverAuthCode,
        }),
      })
        .then(res => res.json())
        .then(resBody => {
          if (resBody.statusCode == 200) {
            props.navigation.navigate('MyTabs');
          }
        })
        .catch(err => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      {authorizedGeolocation && <View style={styles.container}>
        <Image
          source={require('../assets/guidify_logo.png')}
          resizeMode={'contain'}
          style={styles.image}
        />
        <Inputs
          name="Username"
          icon="user"
          style={{
            fontFamily: 'Lexend-Regular'
          }}
          onChangeText={username => setUsername(username)}
        />
        <Inputs
          name="Password"
          icon="lock"
          pass={true}
          onChangeText={passwd => setPasswd(passwd)}
        />
        <View style={{width: '90%'}}>
          <Text style={[styles.textBody, {alignSelf: 'flex-end'}]}>
            Forgot Password?
          </Text>
        </View>
        <Submit title="Login" color="black" handleSubmit={localSignIn} />
        <Text style={{...styles.textBody, marginTop: 20}}>Or login using</Text>
        <View style={{flexDirection: 'row'}}>
          <Account
            color="black"
            icon="google"
            title="Google"
            signInWithGoogle={signInWithGoogle}
          />
        </View>
        <View style={{flexDirection: 'row', marginVertical: 5}}>
          <Text style={styles.textBody}>Don't have an account?</Text>
          <Text
            style={[styles.textBody, {color: 'black'}]}
            onPress={() => props.navigation.navigate('SignUp')}>
            {' '}
            Sign Up
          </Text>
        </View>
      </View>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    marginVertical: 40,
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

export default Login;
