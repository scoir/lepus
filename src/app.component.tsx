import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppNavigator} from './navigation/app.navigator';
import {AppRoute} from './navigation/app-routes';
import {StateContext} from './state'
import {firebase} from "@react-native-firebase/auth";

import {light, mapping} from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {encode as encodeBase64} from '@stablelib/base64'
import firestore from "@react-native-firebase/firestore";

export default (): React.ReactFragment => {
    const [user, setUser] = useState({uid: ""})
    const [routeName, initializing] = useRegister(user)

    function onAuthStateChanged(user) {
        if (user != null) {
            setUser(user);
        }
    }

    useEffect(() => {
        return firebase.auth().onAuthStateChanged(onAuthStateChanged);
    }, []);

    if (initializing && user.uid != "") {
        return <React.Fragment/>
    }

    return (
        <React.Fragment>
            <IconRegistry icons={EvaIconsPack}/>
            <ApplicationProvider
                mapping={mapping}
                theme={light}>
                <SafeAreaProvider>
                    <NavigationContainer>
                        <AppNavigator initialRouteName={routeName}/>
                    </NavigationContainer>
                </SafeAreaProvider>
            </ApplicationProvider>
        </React.Fragment>
    );
};


const useRegister = (user) => {
    const {keyManager, wallet} = useContext(StateContext)
    const [routeName, setRouteName] = useState(AppRoute.SIGN_IN)
    const [initializing, setInitializing] = useState(true)
    const [local, setLocal] = useState(user)

    useEffect(() => {

        const register = async (userId, publicKey, nextKey) => {
            const user = await firestore().collection('Users').doc(userId).get();

            if (user.exists) {
                // @ts-ignore
                wallet.setCloudAgentId(user.get("cloudAgentId").toString())
                setRouteName(AppRoute.HOME)
                setInitializing(false)
            } else {

                let body = JSON.stringify({
                    public_key: encodeBase64(publicKey),
                    next_key: encodeBase64(nextKey),
                    secret: "ArwXoACJgOleVZ2PY7kXn7rA0II0mHYDhc6WrBH8fDAc"
                });

                let response = await fetch("http://10.0.2.2:11004/cloudagents", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        'Content-Type': "application/json",
                    },
                    body: body
                });

                let json = await response.json()
                if ("cloud_agent_id" in json) {
                    let cloud_agent_id = json["cloud_agent_id"]
                    wallet.setCloudAgentId(cloud_agent_id)
                    await firestore().collection('Users').doc(userId).set({cloudAgentId: cloud_agent_id})
                    setRouteName(AppRoute.HOME)
                    setInitializing(false)
                }
            }
        }

        if (user.uid != local.uid) {
            setLocal(user)
            register(user.uid, keyManager.publicKey(), keyManager.nextKey())
        }

    }, [user])

    return [routeName, initializing]
}