import React, {useEffect} from 'react';
import {FlatList, ListRenderItemInfo, NativeModules} from 'react-native';
import {CredentialsScreenProps} from "../../navigation/credentials.navigator";
import {
    Input,
    Layout,
    List,
    ListElement,
    ListItem,
    ListItemElement,
    StyleService,
    Text,
    useStyleSheet
} from "@ui-kitten/components";
import {Credential} from "../../data/credential.model";
import {AppRoute} from "../../navigation/app-routes";
import {MenuIcon, SearchIcon} from '../../assets/icons';
import {Toolbar} from "../../components/toolbar.component";
import {encodeURLSafe as encodeB64} from "@stablelib/base64";
import {keyManager, wallet} from "../../state";

function listCredentials(body, success) {
    if (wallet.getCloudAgentId() === undefined) {
        success([])
        return
    }

    let key = keyManager.sign(body)
    fetch("http://10.0.2.2:11004/cloudagents/credentials", {
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
            response.json().then(function (json) {
                success(json.credentials)
            })
            .catch(error => console.log("Err:" + error.message));
        })

}


export const CredentialsScreen = (props: CredentialsScreenProps): ListElement => {
    const unpack = (data) => {
        return Object.setPrototypeOf(data, Credential.prototype);
    }

    const [credentials, setCredentials] = React.useState<Credential[]>([]);
    const [query, setQuery] = React.useState<string>('');
    const styles = useStyleSheet(themedStyles);

    useEffect(() => {
        return props.navigation.addListener('focus', () => {
            let body = '{}';
            listCredentials(body, function (data) {
                let creds = data.map(cred => {
                    return unpack(cred)
                })
                setCredentials(creds);
            })
        });
    }, []);


    const onChangeQuery = (query: string): void => {
        let body = '{}';
        listCredentials(body, function (remote) {
            const creds: Credential[] = remote.filter((cred: Credential): boolean => {
                console.log(cred)
                return cred.comment.toLowerCase().includes(query.toLowerCase());
            });

            setCredentials(creds);
            setQuery(query);
        })
    };

    const navigateCredentialDetails = (credential: Credential): void => {
        props.navigation.navigate(AppRoute.CREDENTIALS_DETAILS, {credential});
    };

    const renderCredential = ({item}: ListRenderItemInfo<Credential>): ListItemElement => (
        <ListItem
            style={styles.item}
            key = {item.credential_id}
            onPress={() => { navigateCredentialDetails(item)}}
            title={item.comment}
            description={item.statusString()}
        >
        </ListItem>
    );

    return (
        <Layout style={styles.container}>
            <Toolbar
                title='Credentials'
                backIcon={MenuIcon}
                onBackPress={props.navigation.toggleDrawer}
            />
            <Input
                style={styles.filterInput}
                placeholder='Search'
                value={query}
                accessoryRight={SearchIcon}
                onChangeText={onChangeQuery}
            />
            <FlatList
                style={styles.list}
                data={credentials}
                keyExtractor={({credential_id}, index) => credential_id}
                renderItem={renderCredential}
            />
        </Layout>
    );
}

const themedStyles = StyleService.create({
    container: {
        flex: 1,
    },
    filterInput: {
        marginTop: 16,
        marginHorizontal: 8,
    },
    list: {
        flex: 1,
        backgroundColor: 'background-basic-color-1',
    },
    item: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingHorizontal: 12,
    },
    itemProgressBar: {
        width: '50%',
        marginVertical: 12,
    },
});