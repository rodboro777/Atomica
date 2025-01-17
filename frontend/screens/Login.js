import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, SafeAreaView, Alert, Dimensions, TouchableOpacity, } from 'react-native';
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
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const imageWidth = width * 0.8;

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
        '477719873582-9rbo71baq71nf97lnqn4vh0j1og3em42.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState("");
  const [passwd, setPasswd] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');


  const localSignIn = () => {
    console.log(ip.ip)
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
        console.log(resBody.statusCode);
        if (resBody.statusCode == 200) {

          fetch(`http://${ip.ip}:8000/otp/authenticate`, {
            credentials: 'include',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              phoneNumber: resBody.phone,

            }),
          })
            .then(res => res.json())
            .then(resBody => {
              if (resBody.statusCode == 200) {

                props.navigation.navigate('OTPScreen', { phoneNumber: resBody.phoneNumber });
              }
            })
            .catch(err => console.log(err));
        }
        else if (resBody.statusCode == 403) {
          console.log("wrong something")
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

      console.log("tis ");
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
            console.log("all gucci")
            props.navigation.navigate('MyTabs');
          }
        })
        .catch(err => {
          console.log("tis an rero" + err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView>
      <View style={{
        paddingTop: 50
      }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 35, color: 'blue', fontFamily: 'Cereal_bold', marginVertical: 3 }}>
            Login here
          </Text>
          <Text style={{ fontFamily: 'Cereal_Medium', fontSize: 20, maxWidth: '60%', textAlign: 'center', color: '#000', marginTop: 15 }}>
            Welcome back you've been missed!
          </Text>
        </View>

        <View style={{ marginVertical: 30, justifyContent: 'center', alignItems: 'center' }}>
          <Inputs
            name="Username"
            icon="user"
            style={{
              fontFamily: 'Cereal_Medium',
              color: 'black',
            }}
            onChangeText={username => setUsername(username)}
          />
          <Inputs
            name="Password"
            icon="lock"
            pass={true}
            onChangeText={passwd => setPasswd(passwd)}
          />
          <View style={{ width: '90%', marginTop: 10, marginBottom: 20 }}>
            <Text style={[styles.textBody, { alignSelf: 'flex-end', color: 'blue' }]}>
              Forgot Password?
            </Text>
          </View>
          <LinearGradient
            colors={['orange', 'red']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: '40%', borderRadius: 20, overflow: 'hidden' }}
          >
            <TouchableOpacity onPress={localSignIn}>
              <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
                <Text style={{ fontFamily: 'Cereal_bold', fontSize: 18, color: '#fff', textAlign: 'center' }}>
                  Login
                </Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>
          <Text style={{ ...styles.textBody, marginTop: 30, }}>Or login using</Text>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Account

              icon="google"
              title="Google"
              signInWithGoogle={signInWithGoogle}
              google={true}
            />
            <Account
              icon="user"
              title="Guest Login"
              signInWithGoogle={() => props.navigation.navigate('MyTabs')}
              google={false}
            />
          </View>
          <View style={{ flexDirection: 'row', marginVertical: 15 }}>
            <Text style={[styles.textBody, {}]}>Don't have an account?</Text>
            <Text
              style={[styles.textBody, { color: 'black' }]}
              onPress={() => props.navigation.navigate('SignUp')}>
              {' '}
              Sign Up
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
    fontFamily: 'Cereal_Bold',
    fontSize: 40,
    marginVertical: 10,
    color: 'black',
    fontWeight: 'bold',
  },
  textBody: {
    fontFamily: 'Cereal_Medium',
    fontSize: 17
  }
});

export default Login;
