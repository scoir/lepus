import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Layout, LayoutElement, Text} from '@ui-kitten/components';
import {ConnectionsDetailsScreenProps} from '../../navigation/connections.navigator';
import {Toolbar} from '../../components/toolbar.component';
import {Connection} from '../../data/connection.model';

export type ConnectionsDetailsRouteParams = {
    connection: Connection;
}

export const ConnectionsDetailsScreen = (props: ConnectionsDetailsScreenProps): LayoutElement => {

    const {connection} = props.route.params;

    return (
        <React.Fragment>
            <Toolbar
                appearance='control'
                onBackPress={props.navigation.goBack}
            />
            <Layout style={styles.container}>
                <View style={styles.detailsContainer}>
                    <Text style={styles.title}>
                        {connection.did}
                    </Text>
                    <Text style={styles.title}>
                        {connection.verkey}
                    </Text>
                </View>
            </Layout>
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingVertical: 4,
        paddingHorizontal: 16,
    },
    detailsContainer: {
        flex: 1,
    },
    appBar: {
        height: 192,
    },
    title: {
        marginVertical: 4,
    },
});
