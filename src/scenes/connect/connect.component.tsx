import React from 'react';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Divider, Layout, Text} from '@ui-kitten/components';
import {ConnectScreenProps} from '../../navigation/connect.navigator';
import {Toolbar} from '../../components/toolbar.component';
import {SafeAreaLayout, SafeAreaLayoutElement, SaveAreaInset,} from '../../components/safe-area-layout.component';
import {MenuIcon} from '../../assets/icons';
import QRCodeScanner from 'react-native-qrcode-scanner';

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

const takePicture = async function (camera) {
    const options = {quality: 0.5, base64: true};
    const data = await camera.takePictureAsync(options);
    //  eslint-disable-next-line
    console.log(data.uri);
};

const scannerRef: React.RefObject<QRCodeScanner> = React.createRef();
const reset = () => {
    if (scannerRef !== null && scannerRef.current instanceof QRCodeScanner) {
        scannerRef.current.reactivate()
    }
}

const barcodeRecognized = (barcode) => {
    Alert.alert(
        "Connecting",
        barcode.data,
        [
            {text: "Cancel", onPress: reset, style: "cancel"},
            {text: "OK", onPress: reset}
        ],
    );
    console.warn(barcode.data)
};

export const ConnectScreen = (props: ConnectScreenProps): SafeAreaLayoutElement => (

    <SafeAreaLayout
        style={styles.safeArea}
        insets={SaveAreaInset.TOP}>
        <Toolbar
            title='poop'
            backIcon={MenuIcon}
            onBackPress={props.navigation.toggleDrawer}
        />
        <Divider/>
        <Layout style={styles.container}>
            <QRCodeScanner
                showMarker={true}
                fadeIn={false}
                onRead={barcodeRecognized}>
                {({camera, status}) => {
                    if (status !== 'READY') return <PendingView/>;
                    return (
                        <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
                            <TouchableOpacity onPress={() => takePicture(camera)} style={styles.capture}>
                                <Text style={{fontSize: 12}}> Connect </Text>
                            </TouchableOpacity>
                        </View>
                    );
                }}
            </QRCodeScanner>
        </Layout>
    </SafeAreaLayout>
);

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
});
