import React, {useState} from 'react';
import {View, StyleSheet, Text, Image, ScrollView} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';

import Inputs from '../components/Inputs';
import Submit from '../components/Submit';
import Account from '../components/Account';

const Login = props => {
  
  React.useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '126517507975-hkmu5h3t306dnfjq4p6ppu1ogd8v2ilg.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  const [email, setEmail] = useState('');
  const [passwd, setPasswd] = useState('');

  const localSignIn = () => {
    fetch('http://192.168.0.94:8000/auth/login', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        password: passwd,
      }),
    })
      .then(res => res.json())
      .then(resBody => {
        if (resBody.statusCode == 200) {
          props.navigation.navigate('Map');
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

      fetch('http://192.168.0.94:8000/auth/google', {
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
            props.navigation.navigate('Map');
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
      <View style={styles.container}>
        <Image
          source={require('../assets/login.png')}
          resizeMode={'cover'}
          style={styles.image}
        />
        <Text style={styles.textTitle}>Welcome back</Text>
        <Text style={styles.textBody}>Login into your existing account</Text>
        <View style={{marginTop: 20}} />
        <Inputs
          name="Email"
          icon="user"
          onChangeText={email => setEmail(email)}
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
        <Submit title="LOG IN" color="#0148a4" handleSubmit={localSignIn} />
        <Text style={styles.textBody}>Or login using</Text>
        <View style={{flexDirection: 'row'}}>
          <Account
            color="#ec482f"
            icon="google"
            title="Google"
            signInWithGoogle={signInWithGoogle}
          />
        </View>
        <View style={{flexDirection: 'row', marginVertical: 5}}>
          <Text style={styles.textBody}>Don't have an account</Text>
          <Text
            style={[styles.textBody, {color: 'blue'}]}
            onPress={() => props.navigation.navigate('SignUp')}>
            {' '}
            Sign Up
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 400,
    height: 250,
    marginVertical: 10,
  },
  textTitle: {
    fontFamily: 'Foundation',
    fontSize: 40,
    marginVertical: 10,
    color: 'black',
    fontWeight: 'bold',
  },
  textBody: {
    fontFamily: 'Foundation',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;
