import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Layout, LayoutElement, Text} from '@ui-kitten/components';
import {CredentialsDetailsScreenProps} from '../../navigation/credentials.navigator';
import {Toolbar} from '../../components/toolbar.component';
import {Credential} from '../../data/credential.model';

export type CredentialsDetailsRouteParams = {
    credential: Credential;
}

export const CredentialsDetailsScreen = (props: CredentialsDetailsScreenProps): LayoutElement => {

    const {credential} = props.route.params;

    return (
        <React.Fragment>
            <Toolbar
                appearance='control'
                onBackPress={props.navigation.goBack}
            />
            <Layout style={styles.container}>
                <View style={styles.detailsContainer}>
                    <Text style={styles.title}>
                        {credential.name}
                    </Text>
                    <Text style={styles.title}>
                        {credential.something}
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
