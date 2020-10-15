import React from 'react';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/core';
import {createStackNavigator, StackNavigationProp} from '@react-navigation/stack';
import {ConnectTabNavigationProp} from './home.navigator';
import {AppRoute} from './app-routes';
import {ConnectScreen} from '../scenes/connect';

type ConnectNavigatorParams = {
    [AppRoute.CONNECT]: undefined;
}

export interface ConnectScreenProps {
    navigation: CompositeNavigationProp<
        ConnectTabNavigationProp,
        StackNavigationProp<ConnectNavigatorParams, AppRoute.CONNECT>>;
    route: RouteProp<ConnectNavigatorParams, AppRoute.CONNECT>;
}

const Stack = createStackNavigator<ConnectNavigatorParams>();

export const ConnectNavigator = (): React.ReactElement => (
    <Stack.Navigator headerMode='none'>
        <Stack.Screen name={AppRoute.CONNECT} options={{title: AppRoute.CONNECT}} component={ConnectScreen}/>
    </Stack.Navigator>
);
