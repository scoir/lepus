import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
function ConnectionsScreen({ navigation }) {
    return (React.createElement(View, { style: { flex: 1, justifyContent: 'center', alignItems: 'center' } },
        React.createElement(Text, null, "Connections screen"),
        React.createElement(Button, { title: "Go to Connection Details", onPress: () => navigation.navigate('Details') })));
}
function ConnectionDetail() {
    return (React.createElement(View, { style: { flex: 1, justifyContent: 'center', alignItems: 'center' } },
        React.createElement(Text, null, "Connection Details!")));
}
function CredentialsScreen({ navigation }) {
    return (React.createElement(View, { style: { flex: 1, justifyContent: 'center', alignItems: 'center' } },
        React.createElement(Text, null, "Credentials screen"),
        React.createElement(Button, { title: "Go to Credential Details", onPress: () => navigation.navigate('Details') })));
}
function CredentialsDetail() {
    return (React.createElement(View, { style: { flex: 1, justifyContent: 'center', alignItems: 'center' } },
        React.createElement(Text, null, "Credential Details!")));
}
const ConnectionsStack = createStackNavigator();
function ConnectionsStackScreen() {
    return (React.createElement(ConnectionsStack.Navigator, null,
        React.createElement(ConnectionsStack.Screen, { name: "Connections", component: ConnectionsScreen }),
        React.createElement(ConnectionsStack.Screen, { name: "Details", component: ConnectionDetail })));
}
const CredentialsStack = createStackNavigator();
function CredentialsStackScreen() {
    return (React.createElement(CredentialsStack.Navigator, null,
        React.createElement(CredentialsStack.Screen, { name: "Credentials", component: CredentialsScreen }),
        React.createElement(CredentialsStack.Screen, { name: "Details", component: CredentialsDetail })));
}
const ConnectScreen = () => (React.createElement(View, { style: { flex: 1, justifyContent: 'center', alignItems: 'center' } },
    React.createElement(Text, null, "Connect")));
const Tab = createBottomTabNavigator();
export const HomeNavigator = () => (React.createElement(Tab.Navigator, null,
    React.createElement(Tab.Screen, { name: "Connections", component: ConnectionsStackScreen }),
    React.createElement(Tab.Screen, { name: "Connect", component: ConnectScreen }),
    React.createElement(Tab.Screen, { name: "Credentials", component: CredentialsStackScreen })));
//# sourceMappingURL=home.navigator.js.map