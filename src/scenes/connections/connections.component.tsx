import React, {useEffect} from 'react';
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

export const ConnectionsScreen = (props: ConnectionsScreenProps): ListElement => {
    const unpack = (data) => {
        let d = JSON.parse(data);

        if ('value' in d) {
            return d.value
        }
        return d;
    }

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

    useEffect(() => {
        return props.navigation.addListener('focus', () => {
            NativeModules.Canis.listConnections((data) => {
                setConnections(unpack(data));
            }, (err) => {
                console.log("listConnections error", err);
            });
        });
    }, []);

    const [connections, setConnections] = React.useState<Connection[]>([]);
    const [query, setQuery] = React.useState<string>('');
    const styles = useStyleSheet(themedStyles);

    const onChangeQuery = (query: string): void => {
        NativeModules.Canis.listConnections((data) => {
            let remote = unpack(data)
            const conns: Connection[] = remote.filter((conn: Connection): boolean => {
                return conn.TheirLabel.toLowerCase().includes(query.toLowerCase());
            });

            setConnections(conns);
            setQuery(query);
        }, (err) => {
            console.log("listConnections error", err);
        });

    };

    const navigateConnectionDetails = (connection: Connection): void => {
        props.navigation.navigate(AppRoute.CONNECTIONS_DETAILS, {connection});
    };

    const renderConnection = ({item}: ListRenderItemInfo<Connection>): ListItemElement => (
        <ListItem
            style={styles.item}
            onPress={() => navigateConnectionDetails(item)}>
            <Text category='s1'>
                {item.TheirLabel}
            </Text>
            <Text
                appearance='hint'
                category='c1'>
                {item.TheirDID}
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
                    keyExtractor={({ConnectionID}, index) => ConnectionID}
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