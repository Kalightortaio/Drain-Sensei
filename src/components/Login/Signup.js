import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Text, TextInput, KeyboardAvoidingView, Alert } from 'react-native';
import { withNavigation } from 'react-navigation';
import { showMessage } from "react-native-flash-message";
import styles from '../styles/main';
import { vw, vh } from '../utils/scaling';
import { Auth } from 'aws-amplify';
import { Ionicons } from '@expo/vector-icons';
import RadioForm from 'react-native-simple-radio-button';

var timeout = null;
var isMounted;


class Signup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fname: '',
            lname: '',
            number: '',
            isRooter: 2,
            email: '',
            password: '',
            cpassword: '',
            address: '',
            screen: 0,
            addressValidation: false,
        }
    }
    
    componentDidMount() {
        isMounted = true;
    }

    render() {
        var radio_props = [
            {label: 'Yes', value: 1 },
            {label: 'No', value: 0 }
        ]
        return (
            <View style={styles.splashScreen}>
                <View style={[styles.homeHeaderScreen, styles.row]}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Login')}>
                        <Image source={require('../images/back.png')} style={styles.backImage}></Image>
                    </TouchableOpacity>
                    <Text style={styles.menuText}>
                        <Ionicons size={24} scolor="white" name="md-construct"/>
                        &nbsp;&nbsp;DRAIN SENSEI
                    </Text>
                    <TouchableOpacity style={{ marginLeft: 75 * vw }}>
                        <Image source={require('../images/transparent.png')} style={styles.hamburgerImage}></Image>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 4, marginTop: 3 * vh }}>
                    <KeyboardAvoidingView behavior="padding" enabled>
                        {(this.state.screen == 0) && <View>
                            <TextInput
                                style={styles.registrationField}
                                placeholder="Your phone number"
                                maxLength={64}
                                onChange={(event) => this.setState({ number: event.nativeEvent.text })}
                                value={this.state.number}
                            />
                            <Text style={[styles.normalText, styles.whiteText, { paddingHorizontal: 10 * vw, marginTop: 3 * vh }]}>Your desired phone number should be able to recieve texts. It should also be formatted to international standard (Country-Code Number), an example of this would be 1 8053750174. </Text>
                        </View>}
                        {(this.state.screen == 1) && <View>
                            <TextInput
                                style={styles.registrationField}
                                placeholder="Your first name"
                                maxLength={64}
                                onChange={(event) => this.setState({ fname: event.nativeEvent.text })}
                                value={this.state.fname}
                            />
                            <TextInput
                                style={styles.registrationField}
                                placeholder="Your last name"
                                maxLength={64}
                                onChange={(event) => this.setState({ lname: event.nativeEvent.text })}
                                value={this.state.lname}
                            />
                            <TextInput
                                style={styles.registrationField}
                                placeholder="Your email"
                                maxLength={64}
                                onChange={(event) => this.setState({ email: event.nativeEvent.text })}
                                value={this.state.email}
                            />
                        </View>}
                        {(this.state.screen == 2) && <View>
                            <Text style={[styles.whiteText, styles.normalText, { paddingHorizontal: 10 * vw }]}>Are you a professional rooter looking to utilize this app?</Text>
                            <RadioForm
                                style={{ paddingHorizontal: 10 * vw, paddingTop: 3 * vh }}
                                radio_props={radio_props}
                                initial={-1}
                                onPress={(value) => {this.setState({ isRooter: value })}}
                                labelStyle={[styles.normalText, styles.whiteText]}
                            />
                        </View>}
                        {(this.state.screen == 3) && <View>
                            <TextInput
                                style={styles.registrationField}
                                placeholder="Your address"
                                maxLength={64}
                                onChange={(event) => this._search(event.nativeEvent.text)}
                            />
                            <Text style={[styles.normalText, styles.whiteText, { paddingHorizontal: 10 * vw, marginTop: 3 * vh }]}>{this.state.address}</Text>
                        </View>}
                        {(this.state.screen == 4) && <View>
                            <TextInput
                                style={styles.registrationField}
                                placeholder="Choose your password"
                                secureTextEntry={true}
                                maxLength={64}
                                onChange={(event) => this.setState({ password: event.nativeEvent.text })}
                                value={this.state.password}
                            />
                            <TextInput
                                style={styles.registrationField}
                                placeholder="Confirm password"
                                secureTextEntry={true}
                                maxLength={64}
                                onChange={(event) => this.setState({ cpassword: event.nativeEvent.text })}
                                value={this.state.cpassword}
                            />
                            <TouchableOpacity
                                onPress={this._signup.bind(this)}
                                style={[styles.splashButton, styles.loginBtn, { marginHorizontal: 10 * vw }]}>
                                <Text style={[styles.normalText, styles.whiteText]}>Verify</Text>
                            </TouchableOpacity>
                        </View>}
                    </KeyboardAvoidingView>
                </View>
                <View style={[styles.row, { justifyContent: 'space-between', flex: 1, width: 80 * vw }]}>
                    {(this.state.screen == 0) || <TouchableOpacity
                            onPress={this._previous.bind(this)}
                            style={[styles.smallButton, styles.loginBtn]}>
                            <Text style={[styles.whiteText, styles.normalText]}>Previous</Text>
                    </TouchableOpacity>}
                    {(this.state.screen == 0) && <Text
                        style={{ color: '#323C6D' }}>.</Text>
                    }
                    {(this.state.screen == 4) || <TouchableOpacity
                            onPress={this._next.bind(this)}
                            style={[styles.smallButton, styles.loginBtn]}>
                            <Text style={[styles.whiteText, styles.normalText]}>Next</Text>
                    </TouchableOpacity>}
                </View>
                <View style={{ flex: 2, justifyContent: "center", marginTop: -5 * vh }}>
                    {(this.state.screen == 0) && <View style={[styles.row, { paddingLeft: 9 * vw }]}>
                        <View style={[styles.circle, { backgroundColor: "white" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                    </View>}
                    {(this.state.screen == 1) && <View style={[styles.row, { paddingLeft: 9 * vw }]}>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "white" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                    </View>}
                    {(this.state.screen == 2) && <View style={[styles.row, { paddingLeft: 9 * vw }]}>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "white" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                    </View>}
                    {(this.state.screen == 3) && <View style={[styles.row, { paddingLeft: 9 * vw }]}>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "white" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                    </View>}
                    {(this.state.screen == 4) && <View style={[styles.row, { paddingLeft: 9 * vw }]}>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "#6B7299" }]}/>
                        <View style={[styles.circle, { backgroundColor: "white" }]}/>
                    </View>}
                    <TouchableOpacity
                        onPress={this._gotoverify.bind(this)}
                        style={[styles.splashButton, { marginTop: 2 * vh }]}>
                        <Text style={[styles.smallerText, styles.whiteText]}>Need to Verify? Click here</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    _previous() {
        // If Rooter, skip address screen.
        if ((this.state.isRooter == 1) && (this.state.screen == 4)) {
            if (isMounted) {
                this.setState({ screen: (this.state.screen - 2) })
            }
        } else {
            if (isMounted) {
                this.setState({ screen: (this.state.screen - 1) })
            }
        }
    }

    _next() {
        if (this.state.screen == 0) {
                // Verify Phone Number
                var regex = /^(?:[0-9] ?){6,14}[0-9]$/;
            if (this.state.number == "") {
                if (isMounted) {
                    showMessage({
                        message: "Enter your phone number.",
                        type: "danger",
                        icon: "auto"
                    });
                    return;
                }
            }
            if (!regex.test(this.state.number)) {
                if (isMounted) {
                    showMessage({
                        message: "Entered phone number must be formated internationally. Example: 1 8053750174",
                        type: "danger",
                        icon: "auto"
                    });
                    return;
                }
            }
        }
        if (this.state.screen == 1) {
            // Verify First Name, Last Name, Email
            if (this.state.fname == "") {
                if (isMounted) {
                    showMessage({
                        message: "Enter your first name.",
                        type: "danger",
                        icon: "auto"
                    });
                    return;
                }
            }
            if (this.state.lname == "") {
                if (isMounted) {
                    showMessage({
                        message: "Enter your last name.",
                        type: "danger",
                        icon: "auto"
                    });
                    return;
                }
            }
            if (this.state.email !== "") {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!re.test(String(this.state.email).toLowerCase())) {
                    if (isMounted) {
                        showMessage({
                            message: "Entered email address must be valid.",
                            type: "danger",
                            icon: "auto"
                        });
                        return;
                    }
                }
            }
        }
        if (this.state.screen == 2) {
            // Ask if isRooter
            if (this.state.isRooter == 2) {
                if (isMounted) {
                    showMessage({
                        message: "Select your answer, please",
                        type: "danger",
                        icon: "auto"
                    });
                    return;
                }
            }
        }
        if (this.state.screen == 3) {
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
            }
        }
        // If Rooter, skip address screen.
        if ((this.state.isRooter == 1) && (this.state.screen == 2)) {
            if (isMounted) {
                this.setState({ screen: (this.state.screen + 2) })
            }
        } else {
            if (isMounted) {
                this.setState({ screen: (this.state.screen + 1) })
            }
        }
    }

    _gotoverify() {
        var regex = /^(?:[0-9] ?){6,14}[0-9]$/;
        if (this.state.number == "") {
            if (isMounted) {
                showMessage({
                    message: "Enter your phone number.",
                    type: "danger",
                    icon: "auto"
                });
                return;
            }
        }
        if (!regex.test(this.state.number)) {
            if (isMounted) {
                showMessage({
                    message: "Entered phone number must be formated internationally. Example: 1 8053750174",
                    type: "danger",
                    icon: "auto"
                });
                return;
            }
        } 
        if (isMounted) {
            var user = String(this.state.number).replace(/\s/g, '');
            if (user.startsWith("+") == false) {
                user = "+" + user
            }
            this.props.navigation.navigate('Verify', { user: user })
        }
    }

    _signup() {
        if (this.state.password == "") {
            if (isMounted) {
                showMessage({
                    message: "Enter a password.",
                    type: "danger",
                    icon: "auto"
                });
                return;
            }
        } 
        if (String(this.state.cpassword).length < 8) {
            if (isMounted) {
                showMessage({
                    message: "Your password must be longer than eight characters.",
                    type: "danger",
                    icon: "auto"
                });
                return;
            }
        }
        if (this.state.cpassword == "") {
            if (isMounted) {
                showMessage({
                    message: "Re-enter your password.",
                    type: "danger",
                    icon: "auto"
                });
                return;
            }
        }
        if (this.state.password !== this.state.cpassword) {
            if (isMounted) {
                showMessage({
                    message: "Your passwords do not match!",
                    type: "danger",
                    icon: "auto"
                });
                return;
            }
        }

        if (isMounted) {
            var user = String(this.state.number).replace(/\s/g, '');
            if (user.startsWith("+") == false) {
                user = "+" + user
            }
        }
        
        Auth.signUp({
            'username': String(user),
            'password': String(this.state.cpassword),
            'attributes': {
                'custom:email': String(this.state.email),
                'custom:address': String(this.state.address),
                'phone_number': String(user),
                'name': String(this.state.fname),
                'family_name': String(this.state.lname),
                'custom:isRooter': String(this.state.isRooter),
            },
        })
        .then(() => this.props.navigation.navigate('Verify', { user: user }))
        .catch(function (error) {
            if (error.message == "An account with the given phone_number already exists.") {
                if (isMounted) {
                    showMessage({
                        message: "An account with that phone number already exists!",
                        type: "info",
                        icon: "auto"
                    });
                }
            } if (error.code == "NetworkError") {
                if (isMounted) {
                    showMessage({
                        message: "Unable to connect to the servers. Please check your internet connection and try again.",
                        type: "danger",
                        icon: "auto"
                    });
                }
            } else {
                console.error(error);
            }
        });
    }

    _search(unformattedAddress) {
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
            fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=AIzaSyBDDPc1AqedpsTLpqtmp2UqHUBR7WFJNm8&input=${unformattedAddress}&inputtype=textquery&fields=formatted_address,name&locationbias=ipbias`)
                .then((response) => response = response.json())
                .then((response) => {
                    if (response["status"] == "OK") {
                        var formattedAddress = response["candidates"][0].formatted_address
                        if (isMounted) {
                            this.setState({ addressValidation: true })
                        }
                    } if (response["status"] == "ZERO_RESULTS") {
                        var formattedAddress = "Address not found, please enter a valid address."
                        if (isMounted) {
                            this.setState({ addressValidation: false })
                        }
                    } if (response["status"] == "INVALID_REQUEST") {
                        var formattedAddress = "Invalid query, please enter non-special characters."
                        if (isMounted) {
                            this.setState({ addressValidation: false })
                        }
                    }
                    if (isMounted) {
                        this.setState({ address: formattedAddress })
                    }
                })
                .catch(err => {
                    console.error(err)
                });
        }, 2000)
    }

    componentWillUnmount() {
        isMounted = false;
    }
}

export default withNavigation(Signup);