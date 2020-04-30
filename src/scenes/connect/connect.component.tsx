import React from 'react';
import {StyleSheet, View} from 'react-native';
import { Divider, Layout, Text } from '@ui-kitten/components';
import { ConnectScreenProps } from '../../navigation/connect.navigator';
import { Toolbar } from '../../components/toolbar.component';
import {
    SafeAreaLayout,
    SafeAreaLayoutElement,
    SaveAreaInset,
} from '../../components/safe-area-layout.component';
import { MenuIcon } from '../../assets/icons';

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
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Connect</Text>
            </View>
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
