import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Linking, Alert, FlatList } from 'react-native';
import { withNavigation } from 'react-navigation';
import { showMessage } from 'react-native-flash-message';
import { checkInternetConnection } from 'react-native-offline';
import { vw, vh } from '../utils/scaling';
import styles from '../styles/main';
import HomeNav from './HomeNav';

var timeout = null;
var isMounted;


class Wizard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            screen: 0,
            devAddress: '',
            addressValidation: false,
            networks: {},
            isLoading: true,
            isLoadingText: 'Loading networks...',
            ssid: '',
            login: '',
            pairingError: {},
        }
    }

    componentDidMount() {
        isMounted = true;
    }

    render() {
        const networks = this.state.networks ? Object.values(this.state.networks) : []
        return (
            <View style={styles.splashScreen}>
                <HomeNav />
                <View style={{ flex: 4, marginTop: 3 * vh }}>
                    <KeyboardAvoidingView behavior="padding" enabled>
                        {(this.state.screen == 0) && <View>
                            <TextInput
                                style={styles.registrationField}
                                placeholder="Your address"
                                maxLength={64}
                                onChange={(event) => this._search(event.nativeEvent.text)}
                            />
                            <Text style={[styles.normalText, styles.whiteText, { paddingHorizontal: 10 * vw, marginTop: 3 * vh }]}>{this.state.devAddress}</Text>
                        </View>}
                        {(this.state.screen == 1) && <View>
                            <Text style={[styles.normalText, styles.whiteText, { paddingHorizontal: 10 * vw, marginTop: 3 * vh }]}>Please connect to your Drain Sensei device. The Wifi name starts with "DS" and the password is "12345678". You also need to turn off your mobile data if applicable. Ensure that the device is in pairing mode, indicated by a secondary red led. To put your device into pairing mode, place a strong magnet over the sticker for a period no longer than ten seconds.</Text>
                        </View>}
                        {(this.state.screen == 2) && <View>
                            <View style={[styles.content, { maxHeight: 45 * vh }]}>
                                <View style={[styles.contentTitle, { flexDirection: 'row', alignItems: 'center' }]}>
                                    <Text style={styles.wifiText}>SELECT YOUR WIFI NETWORK</Text>
                                </View>
                                {(this.state.isLoading) && <View style={[styles.contentItemNoBorder, styles.fullWidth]}>
                                    <Text style={styles.normalText}>{this.state.isLoadingText}</Text>
                                </View>}
                                {(this.state.isLoading) || <FlatList
                                    data = {this.state.networks}
                                    renderItem = {({ item, index }) =>
                                        <View>
                                            <TouchableOpacity onPress={() => this._select(index)} style={[(index === networks.length - 1) ? styles.contentItemNoBorder : styles.contentItem, styles.fullWidth]}>
                                                <Text style={styles.normalText}>{item.ssid}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    }
                                    keyExtractor = {item => item.ssid}
                                />}
                            </View>
                        </View>}
                        {(this.state.screen == 3) && <View>
                            <TextInput
                                style={styles.registrationField}
                                placeholder="Your wifi password"
                                maxLength={64}
                                onChange={(event) => this.setState({ login: event.nativeEvent.text })}
                            />
                        </View>}
                        {(this.state.screen == 40) && <View>
                            <Text style={[styles.whiteText, styles.normalText, { paddingHorizontal: 10 * vw, marginTop: 3 * vh }]}>Your device was successfully paired! Click 'Finish' to add your device to your account.</Text>
                        </View>}
                        {(this.state.screen == 41) && <View>
                            <Text style={[styles.whiteText, styles.normalText, { paddingHorizontal: 10 * vw, marginTop: 3 * vh }]}>Unable to connect to your router, please reconfirm your password and try again.</Text>
                        </View>}
                        {(this.state.screen == 42) && <View>
                            <Text style={[styles.whiteText, styles.normalText, { paddingHorizontal: 10 * vw, marginTop: 3 * vh }]}>We were unable to connect to our servers, please send us a bug report.</Text>
                        </View>}
                    </KeyboardAvoidingView>
                </View>
                <View style={[styles.row, { justifyContent: 'space-between', flex: 1, width: 80 * vw }]}>
                    {(this.state.screen == 0 || this.state.screen == 40) || <TouchableOpacity
                            onPress={this._previous.bind(this)}
                            style={[styles.smallButton, styles.loginBtn]}>
                            <Text style={[styles.whiteText, styles.normalText]}>Previous</Text>
                    </TouchableOpacity>}
                    {(this.state.screen == 0 || this.state.screen == 40) && <Text
                        style={{ color: '#323C6D' }}>.</Text>
                    }
                    {(this.state.screen == 2 || this.state.screen == 40 || this.state.screen == 41 || this.state.screen == 42) || <TouchableOpacity
                            onPress={this._next.bind(this)}
                            style={[styles.smallButton, styles.loginBtn]}>
                            <Text style={[styles.whiteText, styles.normalText]}>Next</Text>
                    </TouchableOpacity>}
                    {(this.state.screen == 40) && <TouchableOpacity
                            onPress={this._next.bind(this)}
                            style={[styles.smallButton, styles.loginBtn]}>
                            <Text style={[styles.whiteText, styles.normalText]}>Finish</Text>
                    </TouchableOpacity>}
                    {(this.state.screen == 42) && <TouchableOpacity
                            onPress={this._next.bind(this)}
                            style={[styles.smallButton, styles.loginBtn]}>
                            <Text style={[styles.whiteText, styles.normalText]}>Report</Text>
                    </TouchableOpacity>}
                </View>
                <View style={{ flex: 2, justifyContent: "center", marginTop: -5 * vh }}>
                    {(this.state.screen == 0) && <View style={styles.row}>
                        <View style={[styles.circle, { backgroundColor: "white" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                    </View>}
                    {(this.state.screen == 1) && <View style={styles.row}>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "white" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                    </View>}
                    {(this.state.screen == 2) && <View style={styles.row}>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "white" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                    </View>}
                    {(this.state.screen == 3) && <View style={styles.row}>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "white" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                    </View>}
                    {(this.state.screen == 40 || this.state.screen == 41 || this.state.screen == 42) && <View style={styles.row}>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "white" }]}/>
                    </View>}
                </View>
            </View>
        )
    }

    _previous() {
        if (this.state.screen == 41 || this.state.screen == 42) {
            if (isMounted) {            
                this.setState({ screen: 3 })
            }
        } else {
            if (isMounted) {                
                this.setState({ screen: (this.state.screen - 1) })
            }
        }
    }

    _next() {
        if (this.state.screen == 0) {
            // Verify Address
            if (!this.state.addressValidation) {
                if (isMounted) {
                    showMessage({
                        message: "Enter your correct address.",
                        type: "danger",
                        icon: "auto"
                    });
                    return;
                }
            } else {
                if (isMounted) {
                    this.setState({ screen: 1 })
                }
            }
        }
        if (this.state.screen == 1) {
            let didTimeOut = false;
            
            new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    didTimeOut = true;
                    reject(new Error('Request timed out'));
                }, 200);
                
                fetch('http://192.168.4.1/deviceinfo')
                .then((response) => {
                    // TODO: Save MAC Address
                    clearTimeout(timeout);
                    if(!didTimeOut) {
                        resolve(response);
                    }
                })
                .catch((err) => {
                    if(didTimeOut) return;
                    reject(err);
                });
            })
            .then(() => {
                fetch('http://192.168.4.1/scan')
                .then((response) => {
                    var responseData = (JSON.parse(response._bodyInit))
                    if (!responseData["length"]) {
                        if (isMounted) {
                            this.setState({ isLoadingText: 'No networks in range' })
                        }
                    } else {
                        var responseData = (JSON.parse(response._bodyInit))
                        if (isMounted) {
                            this.setState({
                                networks: responseData,
                                isLoading: false,
                            })
                        }
                    }
                })
                .catch((err) => { console.error(err) })
                if (isMounted) {
                    this.setState({ screen: 2 })
                }
            })
            .catch(() => {
                Alert.alert(
                    'Not connected to device!',
                    'Please ensure that your device is in pairing mode, and that your wifi connection is "DSXXXX" where X are random letters or numbers. The password is "12345678". You might need to turn off mobile data if applicable.',
                    [
                        {text: 'Cancel', style: 'cancel'},
                        {text: 'Okay'},
                    ],
                    {cancelable: true},
                );
            });
        }
        if (this.state.screen == 3) {
            console.log(this.state.login)
            console.log(this.state.ssid)
            fetch(`http://192.168.4.1/select?Router=${this.state.ssid}&Key=${this.state.login}`)
            .then((response) => {
                var responseData = (JSON.parse(response._bodyInit))
                console.log(responseData)
                console.log(responseData["connectionstatus"])
                if (responseData["connectionstatus"] == "0") {
                    if (isMounted) {
                        console.log("Connection Status was 0")
                        this.setState({ screen: 41 })
                    }
                } else {
                    if (isMounted) {
                        console.log("Connection Status was 1")
                        this._reconnect.bind(this)
                    }
                }
            })
            .catch((err) => {
                if (isMounted) {
                    this.setState({ pairingError: err })
                    this.setState({ screen: 42 })
                }
            })
        } 
        if (this.state.screen == 40) {
            if (isMounted) {
                // TODO: Call API to register device
                console.log("UpdateInsert service is not implemented yet, was just debugging the reconnect alert box")
                this.props.navigation.navigate('Home')
            }
        }
        if (this.state.screen == 42) {
            if (isMounted) {
                Linking.openURL(`mailto:sales@drainsensei.com?subject=[Bug Report]&body=Servers were unable to add a device. Here is the following error: ${pairingError}`)
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

    _select(index) {
        if (isMounted) {
            this.setState({ ssid: this.state.networks[index].ssid, screen: 3 })
        }
    }

    _reconnect() {
        Alert.alert(
            'Next Steps',
            'Your device is successfully connected to Wi-Fi! Now please connect back to your network / turn on mobile data, before finishing the pairing process.',
            [{
                text: "I've connected back to Wi-Fi / mobile data",
                onPress: () => {
                    checkInternetConnection().then(isConnected => {
                        if (isConnected) {
                            this.setState({ screen: 40 })
                        } else {
                            this._reconnect();
                        }
                    });
                }
            }],
            {
                cancelable: false
            },
        );
    }

    componentWillUnmount() {
        isMounted = false;
    }
}

export default withNavigation(Wizard)