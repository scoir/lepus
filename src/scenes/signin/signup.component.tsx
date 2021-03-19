// components/signup.js

import React, {Component, useState} from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import {firebase} from '@react-native-firebase/auth';
import {SignUpScreenProps} from "../../navigation/app.navigator";
import {AppRoute} from "../../navigation/app-routes";


export const SignUpView = (props: SignUpScreenProps): React.ReactElement => {

  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const registerUser = () => {
    if(email === '' && password === '') {
      Alert.alert('Enter details to signup!')
    } else {
      setLoading(true)
      firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        res.user.updateProfile({
          displayName: displayName
        })
        console.log('User registered successfully!')
        setLoading(false)
        setDisplayName('');
        setEmail('');
        setPassword('');
        props.navigation.navigate(AppRoute.SIGN_IN)
      })
      .catch(error => setError(error.message))
    }
  }

  if(isLoading){
    return(
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E"/>
        </View>
    )
  }
  return (
      <View style={styles.container}>
        <TextInput
          style={styles.inputStyle}
          placeholder="Name"
          value={displayName}
          onChangeText={setDisplayName}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          maxLength={15}
          secureTextEntry={true}
        />
        <Button
          color="#3740FE"
          title="Signup"
          onPress={() => registerUser()}
        />

        <Text
          style={styles.loginText}
          onPress={() => props.navigation.navigate(AppRoute.SIGN_IN)}>
          Already Registered? Click here to login
        </Text>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 35,
    backgroundColor: '#fff'
  },
  inputStyle: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: 15,
    alignSelf: "center",
    borderColor: "#ccc",
    borderBottomWidth: 1
  },
  loginText: {
    color: '#3740FE',
    marginTop: 25,
    textAlign: 'center'
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  }
});