import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Text, TextInput, KeyboardAvoidingView } from 'react-native';
import { withNavigation } from 'react-navigation';
import { showMessage } from "react-native-flash-message";
import styles from '../styles/main';
import { Auth } from 'aws-amplify';
import { Ionicons } from '@expo/vector-icons';

class Forgot extends Component {

    constructor(props) {
        super(props);
        this.state = {
            code: '',
            Alpha: '',
            Beta: '',
        }
    }

    render() {
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
                <Image source={require('../images/logo.png')} style={styles.splashScreenImage}></Image>
                <KeyboardAvoidingView behavior="padding" enabled>
                    <TextInput
                        style={styles.splashTextInput}
                        placeholder="Your verification code"
                        maxLength={6}
                        onChange={(event) => this.setState({ code: event.nativeEvent.text })}
                        value={this.state.code}
                    />
                    <TextInput
                        style={styles.splashTextInput}
                        placeholder="Enter your new password"
                        secureTextEntry={true}
                        maxLength={64}
                        onChange={(event) => this.setState({ Alpha: event.nativeEvent.text })}
                        value={this.state.Alpha}
                    />
                    <TextInput
                        style={styles.splashTextInput}
                        placeholder="Re-enter your new password"
                        secureTextEntry={true}
                        maxLength={64}
                        onChange={(event) => this.setState({ Beta: event.nativeEvent.text })}
                        value={this.state.Beta}
                    />
                    <TouchableOpacity
                        onPress={this._reset.bind(this)}
                        style={[styles.splashButton, styles.loginBtn]}>
                        <Text style={[styles.normalText, styles.whiteText]}>Reset your password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this._send.bind(this)}
                        style={[styles.splashButton, styles.forgotBtn]}>
                        <Text style={[styles.smallerText, styles.whiteText]}>Didn't get the verification code? Send again!</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        );
    }

    _reset() {
        if (this.state.code == "") {
            showMessage({
                message: "Enter your verification code.",
                type: "danger",
                icon: "auto"
            });
            return;
        } if (this.state.Alpha == "") {
            showMessage({
                message: "Enter your new password.",
                type: "danger",
                icon: "auto"
            });
            return;
        } if (this.state.Beta == "") {
            showMessage({
                message: "Re-Enter your new password.",
                type: "danger",
                icon: "auto"
            });
            return;
        } if (this.state.Alpha !== this.state.Beta) {
            showMessage({
                message: "Your passwords do not match.",
                type: "danger",
                icon: "auto"
            });
            return;
        } else {
            Auth.forgotPasswordSubmit(this.props.navigation.state.params.user, this.state.code, this.state.Beta)
            .then(() => showMessage({
                message: "Your password has been successfully reset!",
                type: "success",
                icon: "auto"
            }))
            .then(setTimeout(() => {
                this.props.navigation.navigate('Login')
            }, 2000))
            .catch(error => console.error(error));
        }
    }

    _send() {
        Auth.forgotPassword(this.props.navigation.state.params.user)
        .then(() =>
            showMessage({
                message: "Your verification code has been sent.",
                type: "success",
                icon: "auto"
            }))
        .catch(function(error) {
            if (error.message == "Password does not conform to policy: Password not long enough") {
                showMessage({
                    message: "Your password must be longer than eight characters.",
                    type: "danger",
                    icon: "auto"
                });
                return;
            } else {
                console.error(error);
            } 
        });
    }
}

export default withNavigation(Forgot);