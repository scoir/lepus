import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeNavigator } from './home.navigator';
import { AppRoute } from './app-routes';
const Stack = createStackNavigator();
export const AppNavigator = (props) => (React.createElement(Stack.Navigator, Object.assign({}, props, { headerMode: 'none' }),
    React.createElement(Stack.Screen, { name: AppRoute.HOME, component: HomeNavigator })));
//# sourceMappingURL=app.navigator.js.map