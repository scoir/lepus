// /**
//  * @format
//  * @flow strict-local
//  */
//
// import * as React from 'react';
// import { Button, Text, View } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//
// // function HomeScreen() {
// //     const [welcome, setWelcome] = useState("i hope this changes");
// //
// //     //register for async responses
// //     DeviceEventEmitter.addListener('default', (message) => {
// //         Alert.alert("Poop", message);
// //         console.log(message)
// //     });
// //
// //     useEffect(() => NativeModules.Nymble.getString((data) => {
// //         setWelcome(unpack(data));
// //     }, (err) => {
// //         console.log("failed to invoke getString", err);
// //     }), []);
// //
// //     const unpack = (data) => {
// //         let d = JSON.parse(data);
// //
// //         if ('value' in d) {
// //             return d.value
// //         }
// //         return d;
// //     }
// //
// //     const getStruct = () => {
// //         NativeModules.Nymble.getStruct((data) => {
// //             setWelcome(unpack(data).Bar);
// //         }, (err) => {
// //             console.log("failed to invoke getStruct", err)
// //         });
// //     }
// //
// //     return (
// //             <SafeAreaView>
// //                 <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
// //                     {global.HermesInternal == null ? null : (
// //                         <View style={styles.engine}>
// //                             <Text style={styles.footer}>Engine: Hermes</Text>
// //                         </View>
// //                     )}
// //                     <View style={styles.body}>
// //                         <View style={styles.sectionContainer}>
// //                             <Button
// //                                 title="Async me"
// //                                 mt={2}
// //                                 color="#ff0000"
// //                                 onPress={() => NativeModules.Nymble.asyncHello(() => {
// //                                 })}
// //                             />
// //                         </View>
// //                         <View style={styles.sectionContainer}>
// //                             <Button
// //                                 title="Struct me"
// //                                 mt={2}
// //                                 color="#ff0000"
// //                                 onPress={getStruct}
// //                             />
// //                         </View>
// //                         <View style={styles.sectionContainer}>
// //                             <Text style={styles.sectionTitle}>
// //                                 Bridge: {welcome}
// //                             </Text>
// //                         </View>
// //                     </View>
// //                 </ScrollView>
// //             </SafeAreaView>
// //     );
// // }
//
// function ConnectionsScreen({ navigation }) {
//     return (
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//             <Text>Connections screen</Text>
//             <Button
//                 title="Go to Connection Details"
//                 onPress={() => navigation.navigate('Details')}
//             />
//         </View>
//     );
// }
//
// function ConnectionDetail() {
//     return (
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//             <Text>Connection Details!</Text>
//         </View>
//     );
// }
//
//
// function CredentialsScreen({ navigation }) {
//     return (
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//             <Text>Credentials screen</Text>
//             <Button
//                 title="Go to Credential Details"
//                 onPress={() => navigation.navigate('Details')}
//             />
//         </View>
//     );
// }
//
// function CredentialsDetail() {
//     return (
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//             <Text>Credential Details!</Text>
//         </View>
//     );
// }
//
//
// const ConnectionsStack = createStackNavigator();
//
// function ConnectionsStackScreen() {
//     return (
//         <ConnectionsStack.Navigator>
//             <ConnectionsStack.Screen name="Connections" component={ConnectionsScreen} />
//             <ConnectionsStack.Screen name="Details" component={ConnectionDetail} />
//         </ConnectionsStack.Navigator>
//     );
// }
//
// const CredentialsStack = createStackNavigator();
//
// function CredentialsStackScreen() {
//     return (
//         <CredentialsStack.Navigator>
//             <CredentialsStack.Screen name="Credentials" component={CredentialsScreen} />
//             <CredentialsStack.Screen name="Details" component={CredentialsDetail} />
//         </CredentialsStack.Navigator>
//     );
// }
//
// const ConnectScreen = () => (
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <Text>Connect</Text>
//     </View>
// );
//
// const Tab = createBottomTabNavigator();
//
// const App: () => React$Node = () => {
//     return (
//         <NavigationContainer>
//
//         </NavigationContainer>
//     );
// };
//
// export default App;
