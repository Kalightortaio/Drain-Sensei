import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Amplify from 'aws-amplify';
import Login from './src/components/Login/Login';
import Forgot from './src/components/Login/Forgot';
import Verify from './src/components/Login/Verify';
import Signup from './src/components/Login/Signup';
import Home from './src/components/Main/Home';
import Account from './src/components/Main/Account';
import Wizard from './src/components/Main/Wizard';
import Device from './src/components/Main/Device';
import FlashMessage from 'react-native-flash-message';

Amplify.configure({
  Auth: {
    userPoolId: 'us-east-1_MTMuQHZIu',
    region: 'us-east-1',
    userPoolWebClientId: '7m00r6kenq7qtcdmeojs5l6frg',
    identityPoolId: 'us-east-1:a0d8e061-dcc7-4d04-bc9d-75595cbc2645',
    mandatorySignIn: false,
    path: '/',
    authenticationFlowType: 'USER_PASSWORD_AUTH'
  }
});

class LoginScreen extends Component {
  render() {
    return (
      <View>
        <StatusBar hidden />
        <Login />
      </View>
    );
  }
}

class SignupScreen extends Component {
  render() {
    return (
      <View>
        <StatusBar hidden />
        <Signup />
      </View>
    );
  }
}

class ForgotPasswordScreen extends Component {
  render() {
    return (
      <View>
        <StatusBar hidden />
        <Forgot />
      </View>
    );
  }
}

class VerifyScreen extends Component {
  render() {
    return (
      <View>
        <StatusBar hidden />
        <Verify />
      </View>
    );
  }
}

class HomeScreen extends Component {
  render() {
    return (
      <View>
        <StatusBar hidden />
        <Home />
      </View>
    );
  }
}

class DeviceScreen extends Component {
  render() {
    return (
      <View>
        <StatusBar hidden />
        <Device />
      </View>
    );
  }
}

class WizardScreen extends Component {
  render() {
    return (
      <View>
        <StatusBar hidden />
        <Wizard />
      </View>
    );
  }
}

class AccountScreen extends Component {
  render() {
    return (
      <View>
        <StatusBar hidden />
        <Account />
      </View>
    );
  }
}

const RootStack = createStackNavigator(
  {
    Login: LoginScreen,
    Signup: SignupScreen,
    Forgot: ForgotPasswordScreen,
    Verify: VerifyScreen,
    Home: HomeScreen,
    Account: AccountScreen,
    Wizard: WizardScreen,
    Device: DeviceScreen,
  },
  {
    initialRouteName: 'Login',
    defaultNavigationOptions: {
      header: null
    },
  },
)

const AppContainer = createAppContainer(RootStack);

export default class App extends Component {
  render () {
    return (
      <View style={{ flex:1, }}>
        <AppContainer />
        <FlashMessage position="top" />
      </View>
    )
  }
}
