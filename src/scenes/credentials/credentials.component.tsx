import React from 'react';
import {ListRenderItemInfo} from 'react-native';
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

const mockCredentials: Credential[] = [
    Credential.mocked(),
    Credential.mockedAgain(),
    Credential.mockedAgainAgain(),
];

export const CredentialsScreen = (props: CredentialsScreenProps): ListElement => {

    const [connections, setCredentials] = React.useState<Credential[]>(mockCredentials);
    const [query, setQuery] = React.useState<string>('');
    const styles = useStyleSheet(themedStyles);

    const onChangeQuery = (query: string): void => {
        const connections: Credential[] = mockCredentials.filter((conn: Credential): boolean => {
            return conn.name.toLowerCase().includes(query.toLowerCase());
        });

        setCredentials(connections);
        setQuery(query);
    };

    const navigateCredentialDetails = (connIndex: number): void => {
        const {[connIndex]: credential} = connections;
        props.navigation.navigate(AppRoute.CREDENTIALS_DETAILS, {credential});
    };

    const renderCredential = ({item}: ListRenderItemInfo<Credential>): ListItemElement => (
        <ListItem
            style={styles.item}
            onPress={navigateCredentialDetails}>
            <Text category='s1'>
                {item.name}
            </Text>
            <Text
                appearance='hint'
                category='c1'>
                {item.something}
            </Text>
        </ListItem>
    );

    return (
        <Layout style={styles.container}>
            <Toolbar
                title='poop'
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
            <List
                style={styles.list}
                data={connections}
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