import React from 'react';
import {createStackNavigator, StackNavigationProp} from '@react-navigation/stack';
import {ConnectTabNavigationProp, HomeNavigator} from './home.navigator';
import {AppRoute} from './app-routes';
import {SigninView} from "../scenes/signin/signin.component";
import {SignUpView} from "../scenes/signin/signup.component";
import {CompositeNavigationProp, RouteProp} from "@react-navigation/core";

type StackNavigatorProps = React.ComponentProps<typeof Stack.Navigator>;

export type AppNavigatorParams = {
    [AppRoute.SIGN_IN]: undefined;
    [AppRoute.SIGN_UP]: undefined;
    [AppRoute.HOME]: undefined;
}

export interface SignInScreenProps {
    navigation: CompositeNavigationProp<
        ConnectTabNavigationProp,
        StackNavigationProp<AppNavigatorParams, AppRoute.SIGN_IN>>;
    route: RouteProp<AppNavigatorParams, AppRoute.SIGN_IN>;
}

export interface SignUpScreenProps {
    navigation: StackNavigationProp<AppNavigatorParams, AppRoute.SIGN_UP>;
    route: RouteProp<AppNavigatorParams, AppRoute.SIGN_UP>;
}

const Stack = createStackNavigator<AppNavigatorParams>();

export const AppNavigator = (props: Partial<StackNavigatorProps>): React.ReactElement => (
    <Stack.Navigator {...props} headerMode='none'>
        <Stack.Screen name={AppRoute.SIGN_IN} options={{title: AppRoute.SIGN_IN}} component={SigninView}/>
        <Stack.Screen name={AppRoute.SIGN_UP} options={{title: AppRoute.SIGN_UP}} component={SignUpView}/>
        <Stack.Screen name={AppRoute.HOME} component={HomeNavigator}/>
    </Stack.Navigator>
);
