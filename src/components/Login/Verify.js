import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Text, TextInput, KeyboardAvoidingView } from 'react-native';
import { withNavigation } from 'react-navigation';
import { showMessage } from "react-native-flash-message";
import styles from '../styles/main';
import { Auth } from 'aws-amplify';
import { Ionicons } from '@expo/vector-icons';

class Verify extends Component {

    constructor(props) {
        super(props);
        this.state = {
            code: '',
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
                    <TouchableOpacity
                        onPress={this._verify.bind(this)}
                        style={[styles.splashButton, styles.loginBtn]}>
                        <Text style={[styles.normalText, styles.whiteText]}>Verify</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this._send.bind(this)}
                        style={[styles.splashButton, styles.forgotBtn]}>
                        <Text style={[styles.smallerTexter, styles.whiteText]}>Don't have the verification code? Send again!</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        );
    }

    _verify() {
        Auth.confirmSignUp(String(this.props.navigation.state.params.user), this.state.code, { forceAliasCreation: true })
        .then(() =>
            showMessage({
                message: "Your account has been verified.",
                type: "success",
                icon: "auto"
            }))
        .then(setTimeout(() => {this.props.navigation.navigate('Login')}, 5000))
        .catch(function (error) {
            if (error.message == "User cannot be confirm. Current status is CONFIRMED") {
                showMessage({
                    message: "Your account is already verified.",
                    type: "info",
                    icon: "auto"
                });
            } else {
                console.error(error);
            }
        });
    }

    _send() {
        Auth.resendSignUp(this.props.navigation.state.params.user)
        .then(() =>
            showMessage({
                message: "Your verification code has been sent.",
                type: "success",
                icon: "auto"
            }))
        .catch(function (error) {
            if (error.message == "User is already confirmed.") {
                showMessage({
                    message: "Your account is already verified.",
                    type: "info",
                    icon: "auto"
                });
                return;
            } else {
                console.error(error);
            }
        });
    }
}

export default withNavigation(Verify);