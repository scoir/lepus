import * as React from 'react';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/core';
import {BottomTabNavigationProp, createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AppRoute} from "./app-routes";
import {createDrawerNavigator, DrawerContentComponentProps, DrawerNavigationProp,} from '@react-navigation/drawer';
import {HomeDrawer, SettingsScreen} from '../scenes/home';
import {HomeIcon, InfoIcon,} from '../assets/icons';
import {ConnectNavigator} from "./connect.navigator";
import {ConnectionsNavigator} from "./connections.navigator";
import {CredentialsNavigator} from "./credentials.navigator";

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

export type ConnectTabNavigationProp = CompositeNavigationProp<BottomTabNavigationProp<HomeBottomTabsNavigatorParams, AppRoute.CONNECT>,
    DrawerNavigationProp<HomeDrawerNavigatorParams, AppRoute.HOME>>;

export interface SettingsScreenProps {
    navigation: DrawerNavigationProp<HomeDrawerNavigatorParams, AppRoute.SETTINGS>;
    route: RouteProp<HomeDrawerNavigatorParams, AppRoute.SETTINGS>;
}

const Drawer = createDrawerNavigator<HomeDrawerNavigatorParams>();
const Tab = createBottomTabNavigator();

const HomeBottomNavigator = (): React.ReactElement => (
    <Tab.Navigator>
        <Tab.Screen name={AppRoute.CONNECTIONS} component={ConnectionsNavigator}/>
        <Tab.Screen name={AppRoute.CONNECT} component={ConnectNavigator}/>
        <Tab.Screen name={AppRoute.CREDENTIALS} component={CredentialsNavigator}/>
    </Tab.Navigator>
);

export const HomeNavigator = (): React.ReactElement => (
    // @ts-ignore: `drawerContent` also contains a DrawerNavigationProp
    <Drawer.Navigator drawerContent={HomeDrawer}>
        <Drawer.Screen
            name={AppRoute.HOME}
            component={HomeBottomNavigator}
            options={{title: 'Home', drawerIcon: HomeIcon}}
        />
        <Drawer.Screen
            name={AppRoute.SETTINGS}
            component={SettingsScreen}
            options={{title: 'Settings', drawerIcon: InfoIcon}}
        />
    </Drawer.Navigator>
);