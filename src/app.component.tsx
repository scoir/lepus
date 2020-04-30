import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppNavigator} from './navigation/app.navigator';
import {AppRoute} from './navigation/app-routes';
import { light, mapping } from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
export default (): React.ReactFragment => {

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
