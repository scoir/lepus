/**
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
    Alert,
    Button,
    DeviceEventEmitter,
    NativeModules,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {Colors,} from 'react-native/Libraries/NewAppScreen';

const App: () => React$Node = () => {
    const [welcome, setWelcome] = React.useState("i hope this changes");

    //register for async responses
    DeviceEventEmitter.addListener('default', (message) => {
        Alert.alert("Poop", message);
        console.log(message)
    });

    //non-async call
    NativeModules.Nymble.stringy((data) => {
        console.log("wat", data)
        setWelcome(data);
    });

    const getStruct = () => {
        console.log("hihihi");

        NativeModules.Nymble.structy((data) => {
            let oof = JSON.parse( data );
            console.log("object", oof)
            console.log("attr", oof.Bar)
            console.log("attr", oof.Baz)
            console.log("attr", oof.Barry)
            console.log("attr", oof.Billy)
            console.log("attr", oof.Nope)
        }, (err) => {
            console.log("failed to invoke structy", err)
        });
    }

    return (
        <>
            <StatusBar barStyle="dark-content"/>
            <SafeAreaView>
                <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
                    {global.HermesInternal == null ? null : (
                        <View style={styles.engine}>
                            <Text style={styles.footer}>Engine: Hermes</Text>
                        </View>
                    )}
                    <View style={styles.body}>
                        <View style={styles.sectionContainer}>
                            <Button
                                title="Async me"
                                mt={2}
                                color="#ff0000"
                                onPress={() => NativeModules.Nymble.asyncHello(() => {
                                })}
                            />
                        </View>
                        <View style={styles.sectionContainer}>
                            <Button
                                title="Struct me"
                                mt={2}
                                color="#ff0000"
                                onPress={getStruct}
                            />
                        </View>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>
                                Bridge: {welcome}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    engine: {
        position: 'absolute',
        right: 0,
    },
    body: {
        backgroundColor: Colors.white,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: Colors.dark,
    },
    highlight: {
        fontWeight: '700',
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
    ctaButtons: {
        paddingBottom: 10,
    }
});

export default App;
