import React from 'react';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/core';
import {createStackNavigator, StackNavigationProp} from '@react-navigation/stack';
import {ConnectTabNavigationProp} from './home.navigator';
import {AppRoute} from './app-routes';
import {ConnectionsDetailsRouteParams, ConnectionsDetailsScreen, ConnectionsScreen} from '../scenes/connections';

type ConnectNavigatorParams = {
    [AppRoute.CONNECTIONS]: undefined;
    [AppRoute.CONNECTIONS_DETAILS]: ConnectionsDetailsRouteParams;
}

export interface ConnectionsScreenProps {
    navigation: CompositeNavigationProp<
        ConnectTabNavigationProp,
        StackNavigationProp<ConnectNavigatorParams, AppRoute.CONNECTIONS>>;
    route: RouteProp<ConnectNavigatorParams, AppRoute.CONNECTIONS>;
}

export interface ConnectionsDetailsScreenProps {
    navigation: StackNavigationProp<ConnectNavigatorParams, AppRoute.CONNECTIONS_DETAILS>;
    route: RouteProp<ConnectNavigatorParams, AppRoute.CONNECTIONS_DETAILS>;
}

const Stack = createStackNavigator<ConnectNavigatorParams>();

export const ConnectionsNavigator = (): React.ReactElement => (
    <Stack.Navigator headerMode='none'>
        <Stack.Screen name={AppRoute.CONNECTIONS}  options={{title: AppRoute.CONNECTIONS}} component={ConnectionsScreen}/>
        <Stack.Screen name={AppRoute.CONNECTIONS_DETAILS}  options={{title: AppRoute.CONNECTIONS_DETAILS}} component={ConnectionsDetailsScreen}/>
    </Stack.Navigator>
);
