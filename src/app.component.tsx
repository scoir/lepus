import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppNavigator} from './navigation/app.navigator';
import {AppRoute} from './navigation/app-routes';
import { StateContext, state } from './state'

import {light, mapping} from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {encode as encodeBase64} from '@stablelib/base64'

export default (): React.ReactFragment => {
    const { keyManager, wallet } = useContext(StateContext)

    const accept = (piid, label) => {
        // NativeModules.Canis.acceptCredential(piid, label, () => {
        //     console.log("it worked, now figure out how to navigate!", label)
        // })
    }

    function register() {

        let body = JSON.stringify({
            public_key: encodeBase64(keyManager.publicKey()),
            next_key: encodeBase64(keyManager.nextKey()),
            secret: "ArwXoACJgOleVZ2PY7kXn7rA0II0mHYDhc6WrBH8fDAc"
        });

        fetch("http://10.0.2.2:11004/cloudagents", {
            method: "POST",
            headers: {
                Accept: "application/json",
                'Content-Type': "application/json",
            },
            body: body
        }).then(function (response) {
            response.json().then(function (json) {
                if ("cloud_agent_id" in json) {
                    let cloud_agent_id = json["cloud_agent_id"]
                    console.log("setting cloud agent id", cloud_agent_id)
                    wallet.setCloudAgentId(cloud_agent_id)
                }
            });

        });

    }

    // NativeModules.Canis.handleCredentialOffers((piid, label) => {
    //     Alert.alert(
    //         "Credential offered, accept?",
    //         label,
    //         [
    //             {text: "Reject", style: "cancel"},
    //             {
    //                 text: "Accept", onPress: () => {
    //                     console.log("accepting", piid, label)
    //                     accept(piid, label);
    //                 }
    //             }
    //         ],
    //     );
    //
    // });

    useEffect(() => {
        register()
    }, []);

    return (
        <React.Fragment>
            <IconRegistry icons={EvaIconsPack}/>
            <ApplicationProvider
                mapping={mapping}
                theme={light}>
                <SafeAreaProvider>
                    <NavigationContainer>
                        <AppNavigator initialRouteName={AppRoute.HOME}/>
                    </NavigationContainer>
                </SafeAreaProvider>
            </ApplicationProvider>
        </React.Fragment>
    );
};
