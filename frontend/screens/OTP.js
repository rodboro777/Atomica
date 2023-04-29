import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import ip from '../ip';

export default function VerifyScreen({ navigation, route }) {
  const { phoneNumber } = route.params;

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleResendCode = () => {
    setIsCodeSent(true);
    fetch(`http://${ip.ip}:8000/otp/authenticate`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: phoneNumber,
      }),
    })
      .then(res => res.json())
      .then(resBody => console.log(resBody.statusCode))
      .catch(err => console.log(err));
  }

  const handleCodeFilled = async (code) => {

    console.log('handleCodeFilled called' + phoneNumber)
    await fetch(`http://${ip.ip}:8000/otp/verify`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: phoneNumber,
        code: code,
      }),
    })
      .then(res => res.json())
      .then(resBody => {
        if (resBody.statusCode == 200) {
          console.log("Code is correct, navigate to Home Screen");
          navigation.navigate('MyTabs');
        } else {
          setErrorMessage('Code entered is incorrect');
          console.log("Code is incorrect");
        }
      })
      .catch(err => console.log(err));
  }

  return (
    <View style={styles.container}>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Text style={styles.title}>Enter verification code</Text>
      <TouchableOpacity
        style={isCodeSent ? styles.buttonSent : styles.button}
        onPress={handleResendCode}
        disabled={isCodeSent}
      >
        {isCodeSent ? (
          <>
            <Text style={styles.buttonTextSent}>Code sent </Text>
            <Text style={styles.checkmark}>✓</Text>
          </>
        ) : (
          <Text style={styles.buttonText}>Resend code</Text>
        )}
      </TouchableOpacity>
      <OTPInputView
        style={{ width: '70%', height: '50%' }}
        pinCount={4}
        autoFocusOnLoad
        codeInputFieldStyle={styles.codeInputField}
        onCodeFilled={code => handleCodeFilled(code)}
      />

    </View>
  );
}

const styles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 30,
  },
  codeInputField: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderRadius: 10,
    color: '#000',
    fontSize: 30,
    fontFamily: 'Cereal_Medium'

  },
  button: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f4511e',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonSent: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2ecc71',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonTextSent: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 10,
    fontFamily: 'Cereal_Medium'
  },
  checkmark: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  }
}