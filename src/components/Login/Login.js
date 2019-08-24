import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Text, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Alert } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Auth } from 'aws-amplify';
import { showMessage } from "react-native-flash-message";
import styles from '../styles/main';
import { Ionicons } from '@expo/vector-icons';

var timeout = null;
var timer = null;

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: '',
      password: '',
      debug: 0,
    }
  }

  render() {
    return (
      <View style={styles.splashScreen}>
        <View style={[styles.homeHeaderScreen, styles.row]}>
          <Text style={styles.menuText}>
              <Ionicons size={24} scolor="white" name="md-construct"/>
              &nbsp;&nbsp;DRAIN SENSEI
          </Text>
        </View>
        <TouchableWithoutFeedback onPress={this._debugLogin.bind(this)}>
          <Image source={require('../images/logo.png')} style={styles.splashScreenImage}></Image>
        </TouchableWithoutFeedback>
        <KeyboardAvoidingView behavior="padding" enabled>
        <TextInput
          style={styles.splashTextInput}
          placeholder="Your phone number"
          maxLength={64}
          onChange={(event) => this.setState({ user: event.nativeEvent.text })}
          value={this.state.user}
        />
        <TextInput
          style={styles.splashTextInput}
          placeholder="Your password"
          secureTextEntry={true}
          maxLength={64}
          onChange={(event) => this.setState({ password: event.nativeEvent.text })}
          value={this.state.password}
        />
        <TouchableOpacity
          onPress={this._login.bind(this)}
          style={[styles.splashButton, styles.loginBtn]}>
          <Text style={[styles.normalText, styles.whiteText]}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this._forgot.bind(this)}
          style={[styles.splashButton, styles.forgotBtn]}>
          <Text style={[styles.smallerText, styles.whiteText]}>Forgot Password?</Text>
        </TouchableOpacity>
        </KeyboardAvoidingView>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Signup')}
          style={[styles.splashButton, styles.signupBtn]}>
          <Text style={[styles.normalText, styles.whiteText]}>Don't have an account? <Text style={styles.boldText}>Sign up.</Text></Text>
        </TouchableOpacity>
      </View>
    );
  }

  _forgot() {
    // Debug Login, not part of the forgot function
    if (this.state.debug > 9) {
      this.setState({ debug: 0})
      Alert.alert(
        'Debug Login',
        'Login as...?',
        [
          {text: 'Customer', onPress: () =>
            
            Auth.signIn({
              username: '+18052086132',
              password: 'Password',
            })
            .then(user => idToken = user.signInUserSession.idToken.jwtToken)
            .then(idToken => this.props.navigation.navigate('Home', { idToken: idToken }))
            .catch(function (error) {
              console.error(error);
            })
          },
          {text: 'Rooter', onPress: () => 
            Auth.signIn({
              username: '+18189005001',
              password: 'drainsense1',
            })
            .then(user => idToken = user.signInUserSession.idToken.jwtToken)
            .then(idToken => this.props.navigation.navigate('Home', { idToken: idToken }))
            .catch(function (error) {
              console.error(error);
            })
          },
        ],
        {cancelable: false},
      );
      return;
    }
    this.setState({ debug: 0})
    // The actual forgot function
    if (this.state.user == "") {
      showMessage({
        message: "Enter a valid phone number to begin.",
        type: "danger",
        icon: "auto"
      });
      return;
    } else {
      var user = String(this.state.user).replace(/\s/g, '');
      if (user.startsWith("+") == false) {
        user = "+" + user
      }
    }
    
    Auth.forgotPassword(user)
    .then(() => this.props.navigation.navigate('Forgot', { user: user }))
    .catch(function (error) {
      if (error.code == "LimitExceededException") {
        showMessage({
          message: "Attempt limit exceeded, please try after some time.",
          type: "danger",
          icon: "auto"
        });
        return;
      } if (error.code == "UserNotFoundException") {
        showMessage({
          message: "Account not found, verify that the account number is correct.",
          type: "danger",
          icon: "auto"
        });
        return;
      } if (error.code == "NetworkError") {
        showMessage({
          message: "Unable to connect to the servers. Please check your internet connection and try again.",
          type: "danger",
          icon: "auto"
        });
        return;
      } else {
        console.error(error);
      }
    });
  }

  _login() {
    this.setState({ debug: 0})
    if (this.state.user == '') {
      showMessage({
        message: "Incomplete Field(s)",
        type: "danger",
        icon: "auto"
      });
      return;
    } if (this.state.password == '') {
      showMessage({
        message: "Incomplete Field(s)",
        type: "danger",
        icon: "auto"
      });
      return;
    } else {
      var user = String(this.state.user).replace(/\s/g, '');
      if (user.startsWith("+") == false) {
        user = "+" + user
      }
      Auth.signIn({
        username: user,
        password: this.state.password,
      })
      .then(user => idToken = user.signInUserSession.idToken.jwtToken)
      .then(idToken => this.props.navigation.navigate('Home', { idToken: idToken }))
      .catch(function (error) { 
        if (error.message == "Incorrect username or password.") {
          showMessage({
            message: "Incorrect Password",
            type: "danger",
            icon: "auto"
          });
          return;
        } if (error.message == "User does not exist.") {
          showMessage({
            message: "Incorrect Phone Number",
            type: "danger",
            icon: "auto"
          });
          return;
        } if (error.message == "User is not confirmed.") {
          showMessage({
            message: "Account is unverified! Click Need to Verify on the Sign Up screen to finish the process.",
            type: "warning",
            icon: "auto"
          });
          return;
        } if (error.code == "NetworkError") {
          showMessage({
            message: "Unable to connect to the servers. Please check your internet connection and try again.",
            type: "danger",
            icon: "auto"
          });
          return;
        } else {
          console.log(error);
        }
      });
    }
  }

  _debugLogin() {
    clearTimeout(timer)
    timer = setTimeout(() => {
      timeout = true
    }, 1000)
    if (timeout) {
      this.setState({ debug: 0 })
      timeout = false
    } else {
      this.setState((prevState) => ({
        debug: prevState.debug + 1
      }));
    }
  }
}

export default withNavigation(Login);
