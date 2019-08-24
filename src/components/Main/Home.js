import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal } from 'react-native';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import { withNavigation } from 'react-navigation';
import { Auth } from 'aws-amplify';
import { vw, vh } from '../utils/scaling';
import styles from '../styles/main';
import HomeNav from './HomeNav';
import { Ionicons } from '@expo/vector-icons';

var isMounted;

class Home extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            data: {},
            isLoading: true,
            progress: 0,
            sortModal: false,
            disconnected: false,
            refresh: false,
            doRefresh: false,
            prevResponse: {},
        };
    }

    componentWillMount() {
        isMounted = true;
        
        // Get attributes
        Auth.currentAuthenticatedUser({
                bypassCache: false
            })
            .then(user => {
                if (isMounted) {
                    this.setState({ user: user.attributes })
                }
            })
            .catch(error => console.error(error));

        // Getmydevices
        fetch("https://2w3xj65kng.execute-api.us-east-1.amazonaws.com/prod", {
            method: "POST",
            headers: {
                Authorization: this.props.navigation.state.params.idToken
            }
        })
        .then((response) => {
            if (response._bodyInit == 'null') {
                setTimeout(() => {
                    if (isMounted) {
                        this.setState({
                            isLoading: false,
                            disconnected: true,
                        })
                    }
                }, 2500)
            } else {
                var responseData = ((JSON.parse(response._bodyInit)).Items)
                setTimeout(() => {
                    if (this.state.user["custom:isRooter"] == "1") {
                        // Creates a new array with the names of the customers before their devices, sans extra names.
                        devData = []
                        encounteredNames = []
                        responseData.forEach(function (obj) {
                            if (!encounteredNames.includes(obj.customerfullname)) {
                                encounteredNames.push(obj.customerfullname)
                                devData.push({
                                    customerfullname: obj.customerfullname
                                })
                            }
                            devData.push(obj)
                        });
                        // Adds keys to the newly created objects so that we can utilize the Flatlist
                        devData.forEach(function (obj, index) {
                            obj.key = String(index)
                        })
                        // Stores the data into a prop.
                        if (isMounted) {
                            this.setState({
                                data: devData,
                                isLoading: false,
                                prevResponse: devData,
                            });
                        }
                    } else {
                        if (isMounted) {
                            this.setState({
                                data: responseData,
                                isLoading: false,
                                prevResponse: responseData,
                            });
                        }
                    }
                }, 2500)
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }

    componentDidMount() {
        if (isMounted) {
            this.setState({ progress: 100 });
        }
        
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", () => {
            if (this.props.navigation.state.params.doRefresh) {
                if (isMounted) {
                    this.setState({ doRefresh: true })
                }
            }

            if (this.state.doRefresh) {
                // Get attributes
                Auth.currentAuthenticatedUser({
                    bypassCache: false
                })
                .then(user => {
                    if (isMounted) {
                        this.setState({
                            user: user.attributes
                        })
                    }
                })
                .catch(error => console.error(error));

                // Getmydevices
                fetch("https://2w3xj65kng.execute-api.us-east-1.amazonaws.com/prod", {
                    method: "POST",
                    headers: {
                        Authorization: this.props.navigation.state.params.idToken
                    }
                })
                .then((response) => {
                    if (response._bodyInit == 'null') {
                        if (isMounted) {
                            this.setState({
                                disconnected: true,
                            })
                        }
                    } else {
                        if (isMounted) {
                            this.setState({
                                disconnected: false,
                            })
                        }
                        var responseDataRefresh = ((JSON.parse(response._bodyInit)).Items)
                        if (responseDataRefresh !== this.state.prevResponse) {
                            if (this.state.user["custom:isRooter"] == "1") {
                                // Creates a new array with the names of the customers before their devices, sans extra names.
                                devData = []
                                encounteredNames = []
                                responseDataRefresh.forEach(function (obj) {
                                    if (!encounteredNames.includes(obj.customerfullname)) {
                                        encounteredNames.push(obj.customerfullname)
                                        devData.push({
                                            customerfullname: obj.customerfullname
                                        })
                                    }
                                    devData.push(obj)
                                });
                                // Adds keys to the newly created objects so that we can utilize the Flatlist
                                devData.forEach(function (obj, index) {
                                    obj.key = String(index)
                                })
                                // Stores the data into a prop.
                                if (isMounted) {
                                    this.setState({
                                        doRefresh: false,
                                        refresh: !this.state.refresh
                                    })
                                    this.setState({
                                        data: devData,
                                        prevResponse: devData,
                                    });
                                    console.log("E" + devData)
                                    if (this.props.navigation.state.params.deviceindex !== undefined) {
                                        this._select(this.props.navigation.state.params.deviceindex)
                                    }
                                }
                            } else {
                                if (isMounted) {
                                    this.setState({
                                        doRefresh: false,
                                        refresh: !this.state.refresh
                                    })
                                    this.setState({
                                        data: responseDataRefresh,
                                        prevResponse: responseDataRefresh,
                                    });
                                    if (this.props.navigation.state.params.deviceindex !== undefined) {
                                        this._select(this.props.navigation.state.params.deviceindex)
                                    }
                                }
                            }
                        }
                    }
                })
                .catch((error) => {
                    console.error(error);
                    this.setState({ doRefresh: false, refresh: !this.state.refresh })
                });
            }
        });
    }

    render() {
        const data = this.state.data ? Object.values(this.state.data) : []
        // Rooter Home
        if (this.state.user["custom:isRooter"] == "1") {
            return (
                <View>
                    <Modal
                        animationType="fade"
                        transparent={false}
                        visible={this.state.sortModal}
                        onRequestClose={this._sort.bind(this)}>
                        <View style={styles.modalFrame}>
                            <View style={[styles.homeHeaderScreen, styles.row]}>
                                <Text style={styles.menuText}>
                                    <Ionicons size={24} scolor="white" name="md-construct"/>
                                    &nbsp;&nbsp;DRAIN SENSEI
                                </Text>
                            </View>
                            <Text style={[styles.normalText, styles.whiteText, { paddingHorizontal: 10 * vw, marginTop: 3 * vh }]}>This feature is still under development. Check back later.</Text>
                            <TouchableOpacity 
                                onPress={() => this._sortModal()}
                                style={[styles.shortBtn, { marginHorizontal: 10 * vw, marginVertical: 5 * vh }]}>
                                <Text style={[styles.normalText, styles.whiteText]}>Sort</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <HomeNav />
                    <View style={(this.state.isLoading) ? styles.homeScreenLoading : styles.homeScreen}>
                        {(this.state.isLoading) && <ProgressBarAnimated
                            width = {90 * vw}
                            value = {this.state.progress}
                            style = {styles.loadingBar}
                            barEasing = {'sin'}
                            barAnimationDuration = {2500}
                            backgroundColor = {'white'}
                        />}
                        {(this.state.isLoading) || <View style={[styles.content, { maxHeight: 85 * vh }]}>
                            <View style={[styles.contentTitle, { flexDirection: 'row', alignItems: 'center' }]}>
                                <Text style={styles.rooterHomeText}>CUSTOMER DEVICES</Text>
                                <TouchableOpacity onPress={() => this._sortModal()}>
                                    <Ionicons size={24} color="grey" name="md-options" style={{ marginLeft: 20 * vw }}/>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data = {data}
                                extraData={this.state.refresh}
                                renderItem = {({ item, index }) => {
                                    if (item.deviceid) {
                                        return (
                                            <TouchableOpacity onPress={() => this._select(index)} style={[(index === data.length - 1) ? styles.contentItemNoBorder : styles.contentItem, styles.fullWidth]}>
                                            {(item.devicestatus == "Red") && <View style={[styles.circle, { backgroundColor: "red" }]}/>}
                                            {(item.devicestatus == "Orange") && <View style={[styles.circle, { backgroundColor: "orange" }]}/>}
                                            {(item.devicestatus == "Green") && <View style={[styles.circle, { backgroundColor: "green" }]}/>}
                                            <View style={{ flexDirection: "column", alignItems: "baseline" }}>
                                                <Text style={styles.normalText}>{item.nickname}</Text>
                                                <Text style={[styles.smallerText, { color: '#757575' }]}>{item.deviceid}</Text>
                                            </View>
                                            </TouchableOpacity>
                                        );
                                    } else {
                                        return (
                                            <View style={[styles.contentItem, styles.fullWidth]}>
                                                <Text style={styles.normalText}>{item.customerfullname}</Text>
                                            </View>
                                        );
                                    }
                                }}
                                keyExtractor = {item => item.key}
                            />
                            {(this.state.disconnected) && <View style={styles.contentItemNoBorder}>
                                <Text style={styles.normalText}>No devices found (Check your internet connection)</Text>
                            </View>}
                        </View>}
                    </View>
                </View>
            );
        // Customer Home
        } else {
            return (
                <View>
                    <Modal
                        animationType="fade"
                        transparent={false}
                        visible={this.state.sortModal}
                        onRequestClose={this._sort.bind(this)}>
                        <View style={styles.modalFrame}>
                            <View style={[styles.homeHeaderScreen, styles.row]}>
                                <Text style={styles.menuText}>
                                    <Ionicons size={24} scolor="white" name="md-construct"/>
                                    &nbsp;&nbsp;DRAIN SENSEI
                                </Text>
                            </View>
                            <Text style={[styles.normalText, styles.whiteText, { paddingHorizontal: 10 * vw, marginTop: 3 * vh }]}>This feature is still under development. Check back later.</Text>
                            <TouchableOpacity 
                                onPress={() => this._sortModal()}
                                style={[styles.shortBtn, { marginHorizontal: 10 * vw, marginVertical: 5 * vh }]}>
                                <Text style={[styles.normalText, styles.whiteText]}>Sort</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <HomeNav />
                    <View style={(this.state.isLoading) ? styles.homeScreenLoading : styles.homeScreen}>
                        {(this.state.isLoading) && <ProgressBarAnimated
                            width = {90 * vw}
                            value = {this.state.progress}
                            style = {styles.loadingBar}
                            barEasing = {'sin'}
                            barAnimationDuration = {2500}
                            backgroundColor = {'white'}
                        />}
                        {(this.state.isLoading) || <View style={[styles.content, { maxHeight: 85 * vh }]}>
                            <View style={[styles.contentTitle, { flexDirection: 'row', alignItems: 'center' }]}>
                                <Text style={styles.homeText}>MY DEVICES</Text>
                                <TouchableOpacity onPress={() => this._sortModal()}>
                                    <Ionicons size={24} color="grey" name="md-options" style={{ marginLeft: 29 * vw }}/>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data = {data}
                                extraData={this.state.refresh}
                                renderItem = {({ item, index }) =>
                                    <View>
                                        <TouchableOpacity onPress={() => this._select(index)} style={[(index === data.length - 1) ? styles.contentItemNoBorder : styles.contentItem, styles.fullWidth]}>
                                            {(item.devicestatus == "Red") && <View style={[styles.circle, { backgroundColor: "red" }]}/>}
                                            {(item.devicestatus == "Orange") && <View style={[styles.circle, { backgroundColor: "orange" }]}/>}
                                            {(item.devicestatus == "Green") && <View style={[styles.circle, { backgroundColor: "green" }]}/>}
                                            <View style={{ flexDirection: "column", alignItems: "baseline" }}>
                                                <Text style={styles.normalText}>{item.nickname}</Text>
                                                <Text style={[styles.smallerText, { color: '#757575' }]}>{item.deviceid}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                }
                                keyExtractor = {item => item.deviceid}
                            />
                            {(this.state.disconnected) && <View style={styles.contentItemNoBorder}>
                                <Text style={styles.normalText}>No devices found (Check your internet connection)</Text>
                            </View>}
                        </View>}
                    </View>
                </View>
            );
        }
    }

    _sort() {
        // A-Z, Z-A radio buttons, A-Z pre-selected.
        // Green, Orange, Red checkboxes, all pre-selected. One must be selected at least. (grey out)
        // Pressing sort will alter the this.state.data by either reversing order or pushing to a new array.
        // The older data is kept incase they want to change options again. Resets on screen reload.
        console.log("WIP")
    }

    _sortModal() {
        if (this.state.sortModal === false) {
            if (isMounted) {
                this.setState({ sortModal: true });
            }
        } else {
            if (isMounted) {
                this.setState({ sortModal: false });
            }
            this._sort();
        }
    }

    _select(index) {
        this.props.navigation.navigate('Device', { deviceObj: this.state.data[index], idToken: this.props.navigation.state.params.idToken, deviceindex: index });
    }

    componentWillUnmount() {
        isMounted = false;
        this.setState({ sortModal: false })

        this.focusListener.remove();
    }
}

export default withNavigation(Home);