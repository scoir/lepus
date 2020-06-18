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
                title={connection.TheirLabel}
                onBackPress={props.navigation.goBack}
            />
            <Layout style={styles.container}>
                <View style={styles.detailsContainer}>
                    <Text style={styles.title}>ConnectionID
                        {connection.ConnectionID}
                    </Text>
                    <Text style={styles.title}>State
                        {connection.State}
                    </Text>
                    <Text style={styles.title}>TheirDID
                        {connection.TheirDID}
                    </Text>
                    <Text style={styles.title}>MyDID
                        {connection.MyDID}
                    </Text>
                    <Text style={styles.title}>ServiceEndPoint
                        {connection.ServiceEndPoint}
                    </Text>
                    {/*<Text style={styles.title}>RecipientKeys*/}
                    {/*    {connection.RecipientKeys[0]}*/}
                    {/*</Text>*/}
                    {/*<Text style={styles.title}>RoutingKeys*/}
                    {/*    {connection.RoutingKeys[0]}*/}
                    {/*</Text>*/}
                    <Text style={styles.title}>InvitationID
                        {connection.InvitationID}
                    </Text>
                    <Text style={styles.title}>InvitationDID
                        {connection.InvitationDID}
                    </Text>
                    {/*<Text style={styles.title}>Implicit*/}
                    {/*    {connection.Implicit}*/}
                    {/*</Text>*/}
                    <Text style={styles.title}>Namespace
                        {connection.Namespace}
                    </Text>
                    <Text style={styles.title}>ThreadID
                        {connection.ThreadID}
                    </Text>
                    <Text style={styles.title}>ParentThreadID
                        {connection.ParentThreadID}
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
