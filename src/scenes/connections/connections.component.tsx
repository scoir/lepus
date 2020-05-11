import React from 'react';
import {ListRenderItemInfo} from 'react-native';
import {ConnectionsScreenProps} from "../../navigation/connections.navigator";
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
import {Connection} from "../../data/connection.model";
import {AppRoute} from "../../navigation/app-routes";
import {MenuIcon, SearchIcon} from '../../assets/icons';
import {Toolbar} from "../../components/toolbar.component";

const mockConnections: Connection[] = [
    Connection.mocked(),
    Connection.mockedAgain(),
    Connection.mockedAgainAgain(),
];

export const ConnectionsScreen = (props: ConnectionsScreenProps): ListElement => {

    const [connections, setConnections] = React.useState<Connection[]>(mockConnections);
    const [query, setQuery] = React.useState<string>('');
    const styles = useStyleSheet(themedStyles);

    const onChangeQuery = (query: string): void => {
        const connections: Connection[] = mockConnections.filter((conn: Connection): boolean => {
            return conn.did.toLowerCase().includes(query.toLowerCase());
        });

        setConnections(connections);
        setQuery(query);
    };

    const navigateConnectionDetails = (connIndex: number): void => {
        const {[connIndex]: connection} = connections;
        props.navigation.navigate(AppRoute.CONNECTIONS_DETAILS, {connection});
    };

    const renderConnection = ({item}: ListRenderItemInfo<Connection>): ListItemElement => (
        <ListItem
            style={styles.item}
            onPress={navigateConnectionDetails}>
            <Text category='s1'>
                {item.did}
            </Text>
            <Text
                appearance='hint'
                category='c1'>
                {item.verkey}
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
                renderItem={renderConnection}
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