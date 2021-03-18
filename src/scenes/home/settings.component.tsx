import React from 'react';
import {NativeModules, StyleSheet} from 'react-native';
import {Button, Divider, Layout, Text} from '@ui-kitten/components';
import {SettingsScreenProps} from '../../navigation/home.navigator';
import {Toolbar} from '../../components/toolbar.component';
import {SafeAreaLayout, SafeAreaLayoutElement, SaveAreaInset,} from '../../components/safe-area-layout.component';

export const SettingsScreen = (props: SettingsScreenProps): SafeAreaLayoutElement => (
    <SafeAreaLayout
        style={styles.safeArea}
        insets={SaveAreaInset.TOP}>
        <Toolbar
            title='Settings'
            onBackPress={props.navigation.goBack}
        />
        <Divider/>
        <Layout style={styles.container}>
            <Button
                style={styles.boom}>
                Nuke DB
            </Button>
            <Button
                style={styles.submitButton}>
                Test Debug Server
            </Button>
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
    appBar: {
        height: 192,
    },
    formContainer: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    formControl: {
        marginVertical: 4,
    },
    submitButton: {
        marginVertical: 24,
    },
    boom: {
        marginVertical: 24,
        backgroundColor: "#FF0000"
    },
    haveAccountButton: {
        alignSelf: 'center',
    },
});
