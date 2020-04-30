import * as React from 'react';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/core';
import {Button, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {BottomTabNavigationProp, createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AppRoute} from "./app-routes";
import {createDrawerNavigator, DrawerContentComponentProps, DrawerNavigationProp,} from '@react-navigation/drawer';
import {HomeDrawer, SettingsScreen} from '../scenes/home';
import {HomeIcon, InfoIcon,} from '../assets/icons';
import {ConnectScreen} from "../scenes/connect";

type HomeDrawerNavigatorParams = {
    [AppRoute.HOME]: undefined;
    [AppRoute.SETTINGS]: undefined;
}

type HomeBottomTabsNavigatorParams = {
    [AppRoute.CONNECTIONS]: undefined;
    [AppRoute.CONNECT]: undefined;
    [AppRoute.CREDENTIALS]: undefined;
}

export type DrawerHomeScreenProps = DrawerContentComponentProps & {
    navigation: DrawerNavigationProp<HomeDrawerNavigatorParams, AppRoute.HOME>;
};

export type ConnectTabNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<HomeBottomTabsNavigatorParams, AppRoute.CONNECT>,
    DrawerNavigationProp<HomeDrawerNavigatorParams, AppRoute.HOME>>;

export interface SettingsScreenProps {
    navigation: DrawerNavigationProp<HomeDrawerNavigatorParams, AppRoute.SETTINGS>;
    route: RouteProp<HomeDrawerNavigatorParams, AppRoute.SETTINGS>;
}


function ConnectionsScreen({navigation}) {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Connections screen</Text>
            <Button
                title="Go to Connection Details"
                onPress={() => navigation.navigate('Details')}
            />
        </View>
    );
}

function ConnectionDetail() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Connection Details!</Text>
        </View>
    );
}


function CredentialsScreen({navigation}) {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Credentials screen</Text>
            <Button
                title="Go to Credential Details"
                onPress={() => navigation.navigate('Details')}
            />
        </View>
    );
}

function CredentialsDetail() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Credential Details!</Text>
        </View>
    );
}


const ConnectionsStack = createStackNavigator();

function ConnectionsStackScreen() {
    return (
        <ConnectionsStack.Navigator>
            <ConnectionsStack.Screen name="Connections" component={ConnectionsScreen}/>
            <ConnectionsStack.Screen name="Details" component={ConnectionDetail}/>
        </ConnectionsStack.Navigator>
    );
}

const CredentialsStack = createStackNavigator();

function CredentialsStackScreen() {
    return (
        <CredentialsStack.Navigator>
            <CredentialsStack.Screen name="Credentials" component={CredentialsScreen}/>
            <CredentialsStack.Screen name="Details" component={CredentialsDetail}/>
        </CredentialsStack.Navigator>
    );
}

const Drawer = createDrawerNavigator<HomeDrawerNavigatorParams>();
const Tab = createBottomTabNavigator();

const HomeBottomNavigator = (): React.ReactElement => (
    <Tab.Navigator>
        <Tab.Screen name={AppRoute.CONNECTIONS} component={ConnectionsStackScreen}/>
        <Tab.Screen name={AppRoute.CONNECT} component={ConnectScreen}/>
        <Tab.Screen name={AppRoute.CREDENTIALS} component={CredentialsStackScreen}/>
    </Tab.Navigator>
);

export const HomeNavigator = (): React.ReactElement => (
    // @ts-ignore: `drawerContent` also contains a DrawerNavigationProp
    <Drawer.Navigator drawerContent={HomeDrawer}>
        <Drawer.Screen
            name={AppRoute.HOME}
            component={HomeBottomNavigator}
            options={{ title: 'Home', drawerIcon: HomeIcon }}
        />
        <Drawer.Screen
            name={AppRoute.SETTINGS}
            component={SettingsScreen}
            options={{ title: 'Settings', drawerIcon: InfoIcon }}
        />
    </Drawer.Navigator>
);