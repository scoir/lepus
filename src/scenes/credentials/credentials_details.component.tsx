import React, {useContext} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {Layout, LayoutElement, Text, Button, Divider, TopNavigation, TopNavigationAction} from '@ui-kitten/components';
import {CredentialsDetailsScreenProps} from '../../navigation/credentials.navigator';
import {Toolbar} from '../../components/toolbar.component';
import {Credential} from '../../data/credential.model';
import {encodeURLSafe as encodeB64} from "@stablelib/base64";
import {StateContext} from "../../state";
import {BackIcon} from "../../assets/icons";

export type CredentialsDetailsRouteParams = {
    credential: Credential;
}

export const CredentialsDetailsScreen = (props: CredentialsDetailsScreenProps): LayoutElement => {
    const {keyManager, wallet} = useContext(StateContext)
    const {credential} = props.route.params;

    function acceptCredential(credentialId) {
        if (wallet.getCloudAgentId() === undefined) {
            return
        }

        let body = '{}'
        let key = keyManager.sign(body)
        console.log("sending key", encodeB64(key))
        console.log(wallet.getCloudAgentId())
        fetch("http://10.0.2.2:11004/cloudagents/credentials/"+credentialId, {
            method: "POST",
            headers: {
                Accept: "application/json",
                'Content-Type': "application/json",
                'x-canis-cloud-agent-id': wallet.getCloudAgentId(),
                'x-canis-cloud-agent-signature': encodeB64(key),
            },
            body: body
        })
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (json) {
                        if (json.error !== undefined) {
                            Alert.alert("Error Occurred", json.message);
                        } else {
                            Alert.alert("Credential Accepted")
                        }
                    })
                } else {
                    response.text().then(function (error) {
                        Alert.alert("Error Occurred", error);
                    })
                }
            })
            .catch(error => console.log(error));

    }

    const renderBackAction = () => (
      <TopNavigationAction icon={BackIcon} onPress={props.navigation.goBack}/>
    );

    const renderAcceptButton =() => {
        if(credential.status === "offered") {
           return <Button style={styles.acceptButton} status="primary" onPress={() => acceptCredential(credential.credential_id)}>ACCEPT</Button>
        }

        return null;
    }

    return (
        <React.Fragment>
            <TopNavigation
                alignment="center"
                title="Credential Details"
                accessoryLeft={renderBackAction}
            />
            <Layout style={styles.container} level="1">
                <View style={styles.detailsContainer}>
                    <Text style={styles.title}>
                        {credential.comment}
                    </Text>
                    <Text style={styles.title}>
                        {credential.statusString()}
                    </Text>
                </View>
                <Divider/>
                <Layout style={styles.buttonContainer} level="1">
                    {renderAcceptButton()}
                    <Button style={styles.deleteButton} status="danger">DELETE</Button>
                </Layout>
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
        flexDirection: "column",
        paddingVertical: 4,
        paddingHorizontal: 16,
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly"
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
    deleteButton: {
        marginVertical: 4,
    },
    acceptButton: {
        marginVertical: 4,
    },
});
