import React from 'react';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/core';
import {createStackNavigator, StackNavigationProp} from '@react-navigation/stack';
import {ConnectTabNavigationProp} from './home.navigator';
import {AppRoute} from './app-routes';
import {CredentialsDetailsRouteParams, CredentialsDetailsScreen, CredentialsScreen} from '../scenes/credentials';

type CredentialNavigatorParams = {
    [AppRoute.CREDENTIALS]: undefined;
    [AppRoute.CREDENTIALS_DETAILS]: CredentialsDetailsRouteParams;
}

export interface CredentialsScreenProps {
    navigation: CompositeNavigationProp<
        ConnectTabNavigationProp,
        StackNavigationProp<CredentialNavigatorParams, AppRoute.CREDENTIALS>>;
    route: RouteProp<CredentialNavigatorParams, AppRoute.CREDENTIALS>;
}

export interface CredentialsDetailsScreenProps {
    navigation: StackNavigationProp<CredentialNavigatorParams, AppRoute.CREDENTIALS_DETAILS>;
    route: RouteProp<CredentialNavigatorParams, AppRoute.CREDENTIALS_DETAILS>;
}

const Stack = createStackNavigator<CredentialNavigatorParams>();

export const CredentialsNavigator = (): React.ReactElement => (
    <Stack.Navigator headerMode='none'>
        <Stack.Screen name={AppRoute.CREDENTIALS}  options={{title: AppRoute.CREDENTIALS}} component={CredentialsScreen}/>
        <Stack.Screen name={AppRoute.CREDENTIALS_DETAILS}  options={{title: AppRoute.CREDENTIALS_DETAILS}} component={CredentialsDetailsScreen}/>
    </Stack.Navigator>
);
