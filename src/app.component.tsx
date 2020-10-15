import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppNavigator} from './navigation/app.navigator';
import {AppRoute} from './navigation/app-routes';
import {light, mapping} from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {Alert, NativeModules} from "react-native";

export default (): React.ReactFragment => {


    const accept = (piid, label) => {
        NativeModules.Canis.acceptCredential(piid, label, () => {
            console.log("it fucking worked, now figure out how to navigate!", label)
        })
    }

    NativeModules.Canis.handleCredentialOffers((piid, label) => {
        Alert.alert(
            "Credential offered, accept?",
            label,
            [
                {text: "Reject", style: "cancel"},
                {
                    text: "Accept", onPress: () => {
                        console.log("accepting", piid, label)
                        accept(piid, label);
                    }
                }
            ],
        );

    });

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
