import React from 'react';
import {Alert, NativeModules, StyleSheet, View} from 'react-native';
import {Divider, Layout, Text} from '@ui-kitten/components';
import {ConnectScreenProps} from '../../navigation/connect.navigator';
import {Toolbar} from '../../components/toolbar.component';
import {SafeAreaLayout, SafeAreaLayoutElement, SaveAreaInset,} from '../../components/safe-area-layout.component';
import {MenuIcon} from '../../assets/icons';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {AppRoute} from "../../navigation/app-routes";

export const ConnectScreen = (props: ConnectScreenProps): SafeAreaLayoutElement => {

    const PendingView = () => (
        <View
            style={{
                flex: 1,
                backgroundColor: 'lightgreen',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text>Waiting</Text>
        </View>
    );

    const scannerRef: React.RefObject<QRCodeScanner> = React.createRef();
    const reset = () => {
        if (scannerRef.current instanceof QRCodeScanner) {
            scannerRef.current.reactivate();
        }
    }

    const connect = (connectionID, label) => {
        NativeModules.Canis.acceptInvitation(connectionID, label, (msg) => {
            props.navigation.navigate(AppRoute.CONNECTIONS)
        }, (err) => {
            console.log("something went wrong accepting invitation ", err)
        })
    }

    const barcodeRecognized = (barcode) => {
        console.log(barcode)
        NativeModules.Canis.handleInvitation(barcode.data, (connectionID, label) => {
            Alert.alert(
                "Accept connection from:",
                label,
                [
                    {text: "Cancel", onPress: reset, style: "cancel"},
                    {
                        text: "OK", onPress: () => {
                            connect(connectionID, label)
                        }
                    }
                ],
            );

        }, (err) => {
            console.log("something went wrong handling the invitation", err)
            // reset();
        });
    };


    return (
        <SafeAreaLayout
            style={styles.safeArea}
            insets={SaveAreaInset.TOP}>
            <Toolbar
                backIcon={MenuIcon}
                onBackPress={props.navigation.toggleDrawer}
            />
            <Divider/>
            <Layout style={styles.container}>
                <QRCodeScanner
                    ref={scannerRef}
                    reactivateTimeout={2}
                    showMarker={true}
                    fadeIn={false}
                    onRead={barcodeRecognized}>
                    {({_, status}) => {
                        if (status !== 'READY') return <PendingView/>;
                    }}
                </QRCodeScanner>
            </Layout>
        </SafeAreaLayout>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
