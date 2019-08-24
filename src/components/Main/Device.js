import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Modal, TextInput, Alert } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { Auth } from 'aws-amplify';
import { vw, vh } from '../utils/scaling';
import styles from '../styles/main';
import HomeNav from './HomeNav';

var timeout = null;
var isMounted;

class Device extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showInformation: true,
            showServices: false,
            nicknameModal: false,
            addressModal: false,
            user: {},
            nickname: "",
            devAddress: '',
            addressValidation: false,
        };
    }

    componentWillMount() {
        isMounted = true;

        Auth.currentAuthenticatedUser({
            bypassCache: false
        })
        .then(user => {
            if (isMounted) {
                this.setState({ user: user.attributes })
            }
        })
        .catch(error => console.error(error));
    }

    render() {
        var unix = this.props.navigation.state.params.deviceObj.installdate;
        var date = new Date(parseInt(unix));
        var year = date.getFullYear();
        var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        var month = months[date.getMonth()];
        var day = date.getDate()
        var daySuffix = String(day).slice(-1)
        if (daySuffix == "1") {
            daySuffix = "st"
        } if (daySuffix == "2") {
            daySuffix = "nd"
        } if (daySuffix == "3") {
            daySuffix = "rd"
        } else {
            daySuffix = "th"
        }
        return (
            <View>
                <Modal
                    animationType="none"
                    transparent={false}
                    visible={this.state.nicknameModal}
                    onRequestClose={this._nicknameModal.bind(this)}>
                    <View style={styles.modalFrame}>
                        <View style={[styles.homeHeaderScreen, styles.row]}>
                            <Text style={styles.menuText}>
                                <Ionicons size={24} scolor="white" name="md-construct"/>
                                &nbsp;&nbsp;DRAIN SENSEI
                            </Text>
                        </View>
                        <View style={{ marginTop: 10 * vh }}/>
                        <TextInput
                            style={styles.registrationField}
                            placeholder={this.props.navigation.state.params.deviceObj.nickname}
                            maxLength={64}
                            onChange={(event) => this.setState({ nickname: event.nativeEvent.text })}
                        />
                        <View style={{ marginTop: 10 * vh }}/>
                        <View style={[styles.row, { justifyContent: 'space-between', flex: 1, width: 80 * vw }]}>
                            <TouchableOpacity 
                                onPress={this._nicknameModal.bind(this)}
                                style={[styles.smallButton, styles.loginBtn]}>
                                <Text style={[styles.normalText, styles.whiteText]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={this._updateNickName.bind(this)}
                                style={[styles.smallButton, styles.loginBtn]}>
                                <Text style={[styles.normalText, styles.whiteText]}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="none"
                    transparent={false}
                    visible={this.state.addressModal}
                    onRequestClose={this._addressModal.bind(this)}>
                    <View style={styles.modalFrame}>
                        <View style={[styles.homeHeaderScreen, styles.row]}>
                            <Text style={styles.menuText}>
                                <Ionicons size={24} scolor="white" name="md-construct"/>
                                &nbsp;&nbsp;DRAIN SENSEI
                            </Text>
                        </View>
                        <View style={{ marginTop: 10 * vh }}/>
                        <TextInput
                            style={styles.registrationField}
                            placeholder={this.props.navigation.state.params.deviceObj.address}
                            maxLength={64}
                            onChange={(event) => this._search(event.nativeEvent.text)}
                        />
                        <Text style={[styles.normalText, styles.whiteText, { paddingHorizontal: 10 * vw, marginTop: 3 * vh }]}>{this.state.devAddress}</Text>
                        <View style={{ marginTop: 10 * vh }}/>
                        <View style={[styles.row, { justifyContent: 'space-between', flex: 1, width: 80 * vw }]}>
                            <TouchableOpacity 
                                onPress={this._addressModal.bind(this)}
                                style={[styles.smallButton, styles.loginBtn]}>
                                <Text style={[styles.normalText, styles.whiteText]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={this._updateAddress.bind(this)}
                                style={[styles.smallButton, styles.loginBtn]}>
                                <Text style={[styles.normalText, styles.whiteText]}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <HomeNav />
                <View style={styles.homeScreen}>
                    {(this.state.showInformation) && <View style={styles.content}>
                        <View style={[styles.contentTitle, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
                            <TouchableOpacity onPress={() => this.setState({ showInformation: true, showServices: false })}
                                style={{ flex: 2, alignItems: 'center', borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: 'grey' }}>
                                <Text style={[ styles.deviceText, { color: '#323C6D' }]}>INFORMATION</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ showInformation: false, showServices: true })}
                                style={{ flex: 2, alignItems: 'center', borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: 'grey' }}>
                                <Text style={ styles.deviceText }>SERVICES</Text>
                            </TouchableOpacity>
                        </View>
                        {(this.state.user["custom:isRooter"] == "1") && <View style={[styles.contentItem, styles.fullWidth]}>
                            <Text style={styles.smallText}>Name: {this.props.navigation.state.params.deviceObj.nickname}</Text>
                        </View>}
                        {(this.state.user["custom:isRooter"] == "1") && <View style={[styles.contentItem, styles.fullWidth]}>
                            <Text numberOfLines={1} style={styles.smallText}>Address: {this.props.navigation.state.params.deviceObj.address}</Text>
                        </View>}
                        {(this.state.user["custom:isRooter"] == "1") || <TouchableOpacity 
                            onPress={this._nicknameModal.bind(this)}
                            style={[styles.contentItem, styles.fullWidth]}>
                            <Text style={[styles.smallText, { flex: 14 }]}>Name: {this.props.navigation.state.params.deviceObj.nickname}</Text>
                            <Ionicons size={20} color="black" name="md-create" style={ styles.iconBuffer }/>
                        </TouchableOpacity>}
                        {(this.state.user["custom:isRooter"] == "1") || <TouchableOpacity 
                            onPress={this._addressModal.bind(this)}    
                            style={[styles.contentItem, styles.fullWidth]}>
                            <Text numberOfLines={1} style={[styles.smallText, { flex: 14 }]}>Address: {this.props.navigation.state.params.deviceObj.address}</Text>
                            <Ionicons size={20} color="black" name="md-create" style={ styles.iconBuffer }/>
                        </TouchableOpacity>}
                        <View style={[styles.contentItem, styles.fullWidth]}>
                            <Text style={styles.smallText}>Device Status: {this.props.navigation.state.params.deviceObj.devicestatus}</Text>
                        </View>
                        <View style={[styles.contentItem, styles.fullWidth]}>
                            <Text style={styles.smallText}>Customer ID: {this.props.navigation.state.params.deviceObj.customerid}</Text>
                        </View>
                        <View style={[styles.contentItem, styles.fullWidth]}>
                            <Text style={styles.smallText}>Rooter ID: {this.props.navigation.state.params.deviceObj.rooterid}</Text>
                        </View>
                        <View style={[styles.contentItem, styles.fullWidth]}>
                            <Text style={styles.smallText}>Device ID: {this.props.navigation.state.params.deviceObj.deviceid}</Text>
                        </View>
                        <View style={[styles.contentItem, styles.fullWidth]}>
                            <Text style={styles.smallText}>Hardware Version: {this.props.navigation.state.params.deviceObj.hardwareversion}</Text>
                        </View>
                        <View style={[styles.contentItem, styles.fullWidth]}>
                            <Text style={styles.smallText}>Install Date: {month} {day}{daySuffix}, {year}</Text>
                        </View>
                        <View style={[styles.contentItemNoBorder, styles.fullWidth]}>
                            <Text style={styles.smallText}>Software Version: {this.props.navigation.state.params.deviceObj.softwareversion}</Text>
                        </View>
                    </View>}
                    {(this.state.showServices) && <View style={styles.content}>
                        <View style={[styles.contentTitle, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
                            <TouchableOpacity
                                onPress={() => this.setState({ showInformation: true, showServices: false })}
                                style={{ flex: 2, alignItems: 'center', borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: 'grey' }}>
                                <Text style={ styles.deviceText }>INFORMATION</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{ flex: 2, alignItems: 'center', borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: 'grey' }}>
                                <Text style={[ styles.deviceText, { color: '#323C6D' }]}>SERVICES</Text>
                            </TouchableOpacity>
                        </View>
                        {(this.state.user["custom:isRooter"] == "1") || <View style={[styles.contentItem, styles.fullWidth]}>
                            <TouchableOpacity
                                onPress={() => Linking.openURL(`tel:${this.props.navigation.state.params.deviceObj.rooterid}`)}
                                style={{ flexDirection: 'row' }}>
                                <Text style={[styles.smallText, { flex: 14 }]}>Contact Rooter</Text>
                                <Ionicons size={20} color="black" name="md-call" style={ styles.iconBuffer }/>
                            </TouchableOpacity>
                        </View>}
                        {(this.state.user["custom:isRooter"] == "1") || <View style={[styles.contentItem, styles.fullWidth]}>
                            <TouchableOpacity
                                onPress={() => Linking.openURL(`mailto:sales@drainsensei.com?subject=[Maintenance] ${this.props.navigation.state.params.deviceObj.deviceid}&body=Please describe your issues, and we will respond to you in a timely manner: `)}
                                style={{ flexDirection: 'row' }}>
                                <Text style={[styles.smallText, { flex: 14 }]}>Request Maintenance</Text>
                                <Ionicons size={20} color="black" name="md-pulse" style={ styles.iconBuffer }/>
                            </TouchableOpacity>
                        </View>}
                        {(this.state.user["custom:isRooter"] == "1") || <View style={[styles.contentItemNoBorder, styles.fullWidth]}>
                            <TouchableOpacity
                                onPress = {() => Linking.openURL(`mailto:sales@drainsensei.com?subject=[Return] ${this.props.navigation.state.params.deviceObj.deviceid}&body=Please describe your reason, if any, for the return and we will respond to you in a timely manner: `)}
                                style={{ flexDirection: 'row' }}>
                                <Text style={[styles.smallText, { flex: 14 }]}>Return Device</Text>
                                <Ionicons size={20} color="black" name="md-paper-plane" style={ styles.iconBuffer }/>
                            </TouchableOpacity>
                        </View>}
                        {(this.state.user["custom:isRooter"] == "1") && <View style={[styles.contentItem, styles.fullWidth]}>
                            <TouchableOpacity
                                onPress={() => Linking.openURL(`tel:${this.props.navigation.state.params.deviceObj.customerid}`)}
                                style={{ flexDirection: 'row' }}>
                                <Text style={[styles.smallText, { flex: 14 }]}>Contact Customer</Text>
                                <Ionicons size={20} color="black" name="md-call" style={ styles.iconBuffer }/>
                            </TouchableOpacity>
                        </View>}
                        {(this.state.user["custom:isRooter"] == "1") && <View style={[styles.contentItemNoBorder, styles.fullWidth]}>
                            <TouchableOpacity
                                onPress={() => Linking.openURL(`mailto:sales@drainsensei.com?subject=[Maintenance] ${this.props.navigation.state.params.deviceObj.deviceid}&body=Please describe your issues, and we will respond to you in a timely manner: `)}
                                style={{ flexDirection: 'row' }}>
                                <Text style={[styles.smallText, { flex: 14 }]}>Request Maintenance</Text>
                                <Ionicons size={20} color="black" name="md-pulse" style={ styles.iconBuffer }/>
                            </TouchableOpacity>
                        </View>}
                    </View>}
                </View>
            </View>
        )
    }

    _nicknameModal() {
        if (this.state.nicknameModal === false) {
            if (isMounted) {
                this.setState({ nicknameModal: true });
            }
        } else {
            if (isMounted) {
                this.setState({ nicknameModal: false });
            }
        }
    }

    _updateNickName() {
        if (this.state.nickname == "") {
            if (isMounted) {
                Alert.alert(
                    'Missing nickname!',
                    'Please ensure that your device has a nickname.',
                    [
                        {text: 'Okay'},
                    ],
                    {cancelable: false},
                );
                return;
            }
        } else {
            if (isMounted) {
                var data = {
                    deviceid: `${this.props.navigation.state.params.deviceObj.deviceid}`,
                    nickname: `${this.state.nickname}`,
                }
                fetch("https://c54zh0sgi4.execute-api.us-east-1.amazonaws.com/Prod", {
                    method: "POST",
                    headers: {
                        Authorization: this.props.navigation.state.params.idToken,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then(() => {
                    this._nicknameModal();
                    this.props.navigation.navigate('Home', { idToken: this.props.navigation.state.params.idToken, deviceindex: this.props.navigation.state.params.deviceindex, doRefresh: true });
                })
                .catch((err) => {
                    this._nicknameModal();
                    console.error(err);
                });
            }
        }
    }

    _addressModal() {
        if (this.state.addressModal === false) {
            if (isMounted) {
                this.setState({ addressModal: true });
            }
        } else {
            if (isMounted) {
                this.setState({ addressModal: false });
            }
        }
    }

    _updateAddress() {
        if (!this.state.addressValidation) {
            if (isMounted) {
                Alert.alert(
                    'Missing address!',
                    'Please ensure that your address is validated.',
                    [{
                        text: 'Okay'
                    }, ], {
                        cancelable: false
                    },
                );
                return;
            }
        } else {
            if (isMounted) {
                var data = {
                    deviceid: `${this.props.navigation.state.params.deviceObj.deviceid}`,
                    address: `${this.state.devAddress}`,
                }
                fetch("https://c54zh0sgi4.execute-api.us-east-1.amazonaws.com/Prod", {
                    method: "POST",
                    headers: {
                        Authorization: this.props.navigation.state.params.idToken
                    },
                    body: JSON.stringify(data)
                })
                .then(() => {
                    this._addressModal();
                    this.props.navigation.navigate('Home', { idToken: this.props.navigation.state.params.idToken, deviceindex: this.props.navigation.state.params.deviceindex, doRefresh: true });
                })
                .catch((err) => {
                    this._addressModal();
                    console.error(err);
                })
            }
        }
    }

    _search(unformattedAddress) {
        if (isMounted) {
            this.setState({ devAddress: "Validating Address..." })
        }
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
            fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=AIzaSyBDDPc1AqedpsTLpqtmp2UqHUBR7WFJNm8&input=${unformattedAddress}&inputtype=textquery&fields=formatted_address,name&locationbias=ipbias`)
                .then((response) => {
                    var responseData = (JSON.parse(response._bodyInit))
                    if (responseData["status"] == "OK") {
                        var formattedAddress = responseData["candidates"][0].formatted_address
                        if (isMounted) {
                            this.setState({ addressValidation: true })
                        }
                    } if (responseData["status"] == "ZERO_RESULTS") {
                        var formattedAddress = "Address not found, please enter a valid address."
                        if (isMounted) {
                            this.setState({ addressValidation: false })
                        }
                    } if (responseData["status"] == "INVALID_REQUEST") {
                        var formattedAddress = "Invalid query, please enter non-special characters."
                        if (isMounted) {
                            this.setState({ addressValidation: false })
                        }
                    }
                    if (isMounted) {
                        this.setState({ devAddress: formattedAddress })
                    }
                })
                .catch(() => {
                    var formattedAddress = "Could not communicate with servers. Please check your internet connection and try again."
                    if (isMounted) {
                        this.setState({ addressValidation: false, devAddress: formattedAddress })
                    }
                });
        }, 2000)
    }

    componentWillUnmount() {
        isMounted = false;
        this.setState({
            nicknameModal: false,
            addressModal: false,
        })
    }
}

export default withNavigation(Device)