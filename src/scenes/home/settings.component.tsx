import React from 'react';
import {StyleSheet} from 'react-native';
import {Divider, Layout, Text} from '@ui-kitten/components';
import {SettingsScreenProps} from '../../navigation/home.navigator';
import {Toolbar} from '../../components/toolbar.component';
import {SafeAreaLayout, SafeAreaLayoutElement, SaveAreaInset,} from '../../components/safe-area-layout.component';

export const SettingsScreen = (props: SettingsScreenProps): SafeAreaLayoutElement => (
    <SafeAreaLayout
        style={styles.safeArea}
        insets={SaveAreaInset.TOP}>
        <Toolbar
            title='poop'
            onBackPress={props.navigation.goBack}
        />
        <Divider/>
        <Layout style={styles.container}>
            <Text category='h1'>
                Settings
            </Text>
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
});
