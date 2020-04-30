import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppNavigator} from './navigation/app.navigator';
import {AppRoute} from './navigation/app-routes';

export default (): React.ReactFragment => {

    return (
        <React.Fragment>
            <SafeAreaProvider>
                <NavigationContainer>
                    <AppNavigator initialRouteName={AppRoute.HOME}/>
                </NavigationContainer>
            </SafeAreaProvider>
        </React.Fragment>
    );
};
