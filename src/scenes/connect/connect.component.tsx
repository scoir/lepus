import React, {useContext} from 'react';
import {Alert, NativeModules, StyleSheet, View} from 'react-native';
import {Divider, Layout, Text} from '@ui-kitten/components';
import {ConnectScreenProps} from '../../navigation/connect.navigator';
import { StateContext, state } from '../../state'
import {Toolbar} from '../../components/toolbar.component';
import {SafeAreaLayout, SafeAreaLayoutElement, SaveAreaInset,} from '../../components/safe-area-layout.component';
import {MenuIcon} from '../../assets/icons';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {AppRoute} from "../../navigation/app-routes";
import {encodeURLSafe as encodeB64, decodeURLSafe as decodeB64} from "@stablelib/base64";
import {decode as decodeUTF} from "@stablelib/utf8";

export const ConnectScreen = (props: ConnectScreenProps): SafeAreaLayoutElement => {
    const { keyManager, wallet } = useContext(StateContext)

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

    const barcodeRecognized = (barcode) => {

        let bc = decodeB64(barcode.data);
        let body = JSON.stringify({
            invitation: decodeUTF(bc)
        });



        let invite = JSON.parse(decodeUTF(bc))
        let label = invite.label

        Alert.alert(
            "Accept connection from:",
            label,
            [
                {text: "Cancel", onPress: reset, style: "cancel"},
                {
                    text: "OK", onPress: () => {
                        connect(body)
                    }
                }
            ],
        );

    };

    const connect = (body) => {
        console.log(wallet.getCloudAgentId())

        let key = keyManager.sign(body)
        fetch("http://10.0.2.2:11004/cloudagents/invitation", {
            method: "POST",
            headers: {
                Accept: "application/json",
                'Content-Type': "application/json",
                'x-canis-cloud-agent-id': wallet.getCloudAgentId(),
                'x-canis-cloud-agent-signature': encodeB64(key),
            },
            body: body
        }).then(function (response) {
            response.json().then(function (json) {
                console.log(json);
                props.navigation.navigate(AppRoute.CONNECTIONS)
            });

        });

    }


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
