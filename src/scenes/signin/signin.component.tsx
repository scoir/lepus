import React from "react";
import {useState} from "react";
import {ActivityIndicator, Alert, Button, StyleSheet, TextInput, View} from "react-native";
import { Text } from 'react-native';
import {firebase} from "@react-native-firebase/auth";
import {SignInScreenProps} from "../../navigation/app.navigator";
import {AppRoute} from "../../navigation/app-routes";

export const SigninView = (props: SignInScreenProps): React.ReactElement => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState("")

    if(isLoading){
      return(
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E"/>
        </View>
      )
    }


    const userLogin = () => {
      if(email === '' && password === '') {
        Alert.alert('Enter details to signin!')
      } else {
          setLoading(true)
        firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((res) => {
          console.log(res)
          console.log('User logged-in successfully!')
            setLoading(false);
            setEmail("");
            setPassword("");

          props.navigation.navigate(AppRoute.HOME)
        })
        .catch(error => setError(error.message))
      }
    }

    return (
      <View style={styles.container}>
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
          title="Signin"
          onPress={() => userLogin()}
        />

        <Text
          style={styles.loginText}
          onPress={() => props.navigation.navigate(AppRoute.SIGN_UP)}>
          Don't have account? Click here to signup
        </Text>
      </View>
    )
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