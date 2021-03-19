import React, {useEffect, useContext} from 'react';
import {FlatList, ListRenderItemInfo, NativeModules, RefreshControl, SafeAreaView} from 'react-native';
import {ConnectionsScreenProps} from "../../navigation/connections.navigator";
import {
    Input,
    Layout,
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
import {encodeURLSafe as encodeB64} from "@stablelib/base64";
import {StateContext} from '../../state'
import {useInterval} from '../../hooks/use.interval'

export const ConnectionsScreen = (props: ConnectionsScreenProps): ListElement => {
    const {keyManager, wallet} = useContext(StateContext)
    const [refreshing, setRefreshing] = React.useState(false);

    function wait(timeout) {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        wait(2000).then(() => setRefreshing(false));
    }, [refreshing]);


    useInterval(() => {
       // Your custom logic here
        let body = '{}';

        listConnections(body, function (conns) {
            setConnections(conns);
        })
    }, 1000);

    useEffect(() => {
    }, []);

    function handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    function listConnections(body, success) {
        if (wallet.getCloudAgentId() === undefined) {
            success([])
            return
        }

        let key = keyManager.sign(body)
        fetch("http://10.0.2.2:11004/cloudagents/connections", {
            method: "POST",
            headers: {
                Accept: "application/json",
                'Content-Type': "application/json",
                'x-canis-cloud-agent-id': wallet.getCloudAgentId(),
                'x-canis-cloud-agent-signature': encodeB64(key),
            },
            body: body
        })
            .then(handleErrors)
            .then(function (response) {
                response.json().then(function (json) {
                    success(json.connections)
                })
            })
            .catch(error => console.log(error));

    }

    const [connections, setConnections] = React.useState<Connection[]>([]);
    const [query, setQuery] = React.useState<string>('');
    const styles = useStyleSheet(themedStyles);

    const onChangeQuery = (query: string): void => {
        let body = '{}'
        listConnections(body, function (remote) {
            const conns: Connection[] = remote.filter((conn: Connection): boolean => {
                return conn.name.toLowerCase().includes(query.toLowerCase());
            });

            setConnections(conns);
            setQuery(query);
        })
    };

    const navigateConnectionDetails = (connection: Connection): void => {
        props.navigation.navigate(AppRoute.CONNECTIONS_DETAILS, {connection});
    };

    const renderConnection = ({item}: ListRenderItemInfo<Connection>): ListItemElement => (
        <ListItem
            style={styles.item}
            onPress={() => navigateConnectionDetails(item)}>
            <Text category='s1'>
                {item.name}
            </Text>
            <Text
                appearance='hint'
                category='c1'>
                {item.their_did}
            </Text>
        </ListItem>
    );

    return (
        <Layout style={styles.container}>
            <Toolbar
                title='Connections'
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
            <SafeAreaView style={styles.container}>
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                <FlatList
                    style={styles.list}
                    data={connections}
                    keyExtractor={({id}, index) => id}
                    renderItem={renderConnection}
                />
            </SafeAreaView>
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