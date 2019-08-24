import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { Auth } from 'aws-amplify';
import { vw, vh } from '../utils/scaling';
import styles from '../styles/main';
import HomeNav from './HomeNav';

var timeout = null;
var isMounted;

class Account extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            nameModal: false,
            emailModal: false,
            addressModal: false,
            email: "",
            address: "",
            fname: "",
            lname: "",
            devAddress: '',
            addressValidation: false,
        }
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
        return (
            <View>
                <Modal
                    animationType="fade"
                    transparent={false}
                    visible={this.state.nameModal}
                    onRequestClose={this._nameModal.bind(this)}>
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
                            placeholder={this.state.user.name}
                            maxLength={64}
                            onChange={(event) => this.setState({ fname: event.nativeEvent.text })}
                        />
                        <TextInput
                            style={styles.registrationField}
                            placeholder={this.state.user.family_name}
                            maxLength={64}
                            onChange={(event) => this.setState({ lname: event.nativeEvent.text })}
                        />
                        <View style={{ marginTop: 10 * vh }}/>
                        <View style={[styles.row, { justifyContent: 'space-between', flex: 1, width: 80 * vw }]}>
                            <TouchableOpacity 
                                onPress={this._nameModal.bind(this)}
                                style={[styles.smallButton, styles.loginBtn]}>
                                <Text style={[styles.normalText, styles.whiteText]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={this._updateName.bind(this)}
                                style={[styles.smallButton, styles.loginBtn]}>
                                <Text style={[styles.normalText, styles.whiteText]}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="fade"
                    transparent={false}
                    visible={this.state.emailModal}
                    onRequestClose={this._emailModal.bind(this)}>
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
                            placeholder={this.state.user["custom:email"]}
                            maxLength={64}
                            onChange={(event) => this.setState({ email: event.nativeEvent.text })}
                        />
                        <View style={{ marginTop: 10 * vh }}/>
                        <View style={[styles.row, { justifyContent: 'space-between', flex: 1, width: 80 * vw }]}>
                            <TouchableOpacity 
                                onPress={this._emailModal.bind(this)}
                                style={[styles.smallButton, styles.loginBtn]}>
                                <Text style={[styles.normalText, styles.whiteText]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={this._updateEmail.bind(this)}
                                style={[styles.smallButton, styles.loginBtn]}>
                                <Text style={[styles.normalText, styles.whiteText]}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="fade"
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
                            placeholder={this.state.user["custom:address"]}
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
                    <View style={styles.content}>
                        <View style={[styles.contentTitle, { flexDirection: 'row', alignItems: 'center' }]}>
                            <View style={{ flex: 1, alignItems: 'center'}}>
                                <Text style={[ styles.deviceText, { color: '#323C6D' }]}>ACCOUNT INFORMATION</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={this._nameModal.bind(this)} style={[styles.contentItem, styles.fullWidth]}>
                            <Text style={[styles.smallText, { flex: 14 }]}>Name: {this.state.user.name} {this.state.user.family_name}</Text>
                            <Ionicons size={20} color="black" name="md-create" style={ styles.iconBuffer }/>
                        </TouchableOpacity>
                        {(this.state.user["custom:isRooter"] == "1") || <TouchableOpacity onPress={this._emailModal.bind(this)} style={[styles.contentItem, styles.fullWidth]}>
                            <Text style={[styles.smallText, { flex: 14 }]}>Email: {this.state.user["custom:email"]}</Text>
                            <Ionicons size={20} color="black" name="md-create" style={ styles.iconBuffer }/>
                        </TouchableOpacity>}
                        {(this.state.user["custom:isRooter"] == "1") && <TouchableOpacity onPress={this._emailModal.bind(this)} style={[styles.contentItem, styles.fullWidth]}>
                            <Text style={[styles.smallText, { flex: 14 }]}>Email: {this.state.user.email}</Text>
                            <Ionicons size={20} color="black" name="md-create" style={ styles.iconBuffer }/>
                        </TouchableOpacity>}
                        {(this.state.user["custom:isRooter"] == "1") || <TouchableOpacity onPress={this._addressModal.bind(this)} style={[styles.contentItem, styles.fullWidth]}>
                            <Text style={[styles.smallText, { flex: 14, overflow: "hidden" }]}>Address: {this.state.user["custom:address"]}</Text>
                            <Ionicons size={20} color="black" name="md-create" style={ styles.iconBuffer }/>
                        </TouchableOpacity>}
                        <View style={[styles.contentItemNoBorder, styles.fullWidth]}>
                            <Text style={styles.smallText}>ID: {this.state.user.phone_number}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    _nameModal() {
        if (this.state.nameModal === false) {
            if (isMounted) {
                this.setState({ nameModal: true });
            }
        } else {
            if (isMounted) {
                this.setState({ nameModal: false });
            }
        }
    }

    _updateName() {
        if (this.state.fname == "") {
            if (isMounted) {
                Alert.alert(
                    'Missing first name!',
                    'Please enter your first name.',
                    [{
                        text: 'Okay'
                    }, ], {
                        cancelable: false
                    },
                );
                return;
            }
        } if (this.state.lname == "") {
            if (isMounted) {
                Alert.alert(
                    'Missing last name!',
                    'Please enter your last name.',
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
                // Call Server
                Alert.alert(
                    'Missing service!',
                    'There is currently no server API to update users.',
                    [{
                        text: 'Okay'
                    }, ], {
                        cancelable: false
                    },
                );
                this._nameModal.bind(this);
            }
        }
    }

    _emailModal() {
        if (this.state.emailModal === false) {
            if (isMounted) {
                this.setState({ emailModal: true });
            }
        } else {
            if (isMounted) {
                this.setState({ emailModal: false });
            }
        }
    }

    _updateEmail() {
        if (this.state.email !== "") {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(String(this.state.email).toLowerCase())) {
                if (isMounted) {
                    Alert.alert(
                        'Syntax Error!',
                        'Please enter a valid email.',
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
                    // Call Server
                    Alert.alert(
                        'Missing service!',
                        'There is currently no server API to update users.',
                        [{
                            text: 'Okay'
                        }, ], {
                            cancelable: false
                        },
                    );
                    this._emailModal.bind(this);
                }
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
                // Call Server
                Alert.alert(
                    'Missing service!',
                    'There is currently no server API to update users.',
                    [{
                        text: 'Okay'
                    }, ], {
                        cancelable: false
                    },
                );
                this._addressModal.bind(this);
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
            fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=AIzaSyDe78fuRVhrO9NMV3xYkK4MTYu3-U6aFhk&input=${unformattedAddress}&inputtype=textquery&fields=formatted_address,name&locationbias=ipbias`)
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

    _refresh() {
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

    componentWillUnmount() {
        isMounted = false;
        this.setState({ 
            nameModal: false,
            emailModal: false,
            addressModal: false,
        })
    }
}

export default withNavigation(Account)