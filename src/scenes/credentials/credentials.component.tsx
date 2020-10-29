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
import {Connection} from "../../data/connection.model";

export const CredentialsScreen = (props: CredentialsScreenProps): ListElement => {
    const unpack = (data) => {
        let d = JSON.parse(data);

        if ('value' in d) {
            return d.value
        }
        return d;
    }

    const [credentials, setCredentials] = React.useState<Credential[]>([]);
    const [query, setQuery] = React.useState<string>('');
    const styles = useStyleSheet(themedStyles);

    useEffect(() => {
        return props.navigation.addListener('focus', () => {
            NativeModules.Canis.listCredentials((data) => {
                setCredentials(unpack(data));
            }, (err) => {
                console.log("listCredentials error", err);
            });
        });
    }, []);


    const onChangeQuery = (query: string): void => {
        NativeModules.Canis.listCredentials((data) => {
            let remote = unpack(data)
            const creds: Credential[] = remote.filter((cred: Credential): boolean => {
                console.log(cred)
                return cred.name.toLowerCase().includes(query.toLowerCase());
            });

            setCredentials(creds);
            setQuery(query);
        }, (err) => {
            console.log("listCredentials error", err);
        });
    };

    const navigateCredentialDetails = (credential: Credential): void => {
        props.navigation.navigate(AppRoute.CREDENTIALS_DETAILS, {credential});
    };

    const renderCredential = ({item}: ListRenderItemInfo<Credential>): ListItemElement => (
        <ListItem
            style={styles.item}
            onPress={() => { navigateCredentialDetails(item)}}>
            <Text category='s1'>
                {item.name}
            </Text>
            <Text
                appearance='hint'
                category='c1'>
                {item.id}
            </Text>
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
                icon={SearchIcon}
                onChangeText={onChangeQuery}
            />
            <FlatList
                style={styles.list}
                data={credentials}
                keyExtractor={({id}, index) => id}
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