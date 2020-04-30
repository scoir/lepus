import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './navigation/app.navigator';
import { AppRoute } from './navigation/app-routes';
export default () => {
    return (React.createElement(React.Fragment, null,
        React.createElement(SafeAreaProvider, null,
            React.createElement(NavigationContainer, null,
                React.createElement(AppNavigator, { initialRouteName: AppRoute.HOME })))));
};
//# sourceMappingURL=app.component.js.map