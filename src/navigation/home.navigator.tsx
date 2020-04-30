import * as React from 'react';
import {Button, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

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

const ConnectScreen = () => (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Connect</Text>
    </View>
);

const Tab = createBottomTabNavigator();

export const HomeNavigator = (): React.ReactElement => (
    <Tab.Navigator>
        <Tab.Screen name="Connections" component={ConnectionsStackScreen}/>
        <Tab.Screen name="Connect" component={ConnectScreen}/>
        <Tab.Screen name="Credentials" component={CredentialsStackScreen}/>
    </Tab.Navigator>
);