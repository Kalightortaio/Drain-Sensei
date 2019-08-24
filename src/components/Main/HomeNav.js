import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Animated, BackHandler, Text, Linking } from 'react-native';
import { withNavigation } from 'react-navigation';
import { vw, vh } from '../utils/scaling';
import styles from '../styles/main';
import { Easing } from 'react-native-reanimated';
import { Auth } from 'aws-amplify';
import { Ionicons } from '@expo/vector-icons';


class HomeNav extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isClosed: true,
            fadeValue: new Animated.Value(0),
            toggleWidth: 0,
            user: {},
        }
    }

    componentWillMount() {
        // Get attributes
        Auth.currentAuthenticatedUser({
                bypassCache: false
            })
            .then(user => this.setState({
                user: user.attributes
            }))
            .catch(error => console.error(error));
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (!this.state.isClosed) {
                this._menu();
                return true;
            } if (this.props.navigation.state.routeName == 'Home') {
                BackHandler.exitApp();
                return true;
            } else {
                this.props.navigation.navigate('Home')
                return true;
            }
        });
    }

    render() {
        return (
        <View>
            <View style={[styles.homeHeaderScreen, styles.row]}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
                    <Image source={require('../images/home.png')} style={styles.homeImage}></Image>
                </TouchableOpacity>
                <Text style={styles.menuText}>
                    <Ionicons size={24} color="white" name="md-construct"/>
                    &nbsp;&nbsp;DRAIN SENSEI
                </Text>
                <TouchableOpacity onPress={this._menu.bind(this)} style={{ marginLeft: 75 * vw }}>
                    <Image source={require('../images/hamburger.png')} style={styles.hamburgerImage}></Image>
                </TouchableOpacity>
            </View>
            <Animated.View style={[styles.menu, { width: this.state.toggleWidth, opacity: this.state.fadeValue }]}>
                <View style={{ justifyContent: 'flex-start' }}>
                    <View style={styles.hr}/>
                    <TouchableOpacity onPress={this._account.bind(this)} style={styles.menuItem}>
                        <Ionicons size={24} color="white" name="md-contact" style={{ marginRight: 2 * vw }}/>
                        <Text numberOfLines={1} style={[styles.normalText, styles.whiteText]}>My Account</Text>
                    </TouchableOpacity>
                    {(this.state.user["custom:isRooter"] == "1") || <View style={styles.hr}/>}
                    {(this.state.user["custom:isRooter"] == "1") || <TouchableOpacity onPress={this._wizard.bind(this)} style={styles.menuItem}>
                        <Ionicons size={24} color="white" name="md-add-circle-outline" style={{ marginRight: 2 * vw }}/>
                        <Text numberOfLines={1} style={[styles.normalText, styles.whiteText]}>Add a Device</Text>
                    </TouchableOpacity>}
                    {(this.state.user["custom:isRooter"] == "1") || <View style={styles.hr}/>}
                    {(this.state.user["custom:isRooter"] == "1") || <TouchableOpacity onPress={this._order.bind(this)} style={styles.menuItem}>
                        <Ionicons size={24} color="white" name="md-basket" style={{ marginRight: 2 * vw }}/>
                        <Text numberOfLines={1} style={[styles.normalText, styles.whiteText]}>Order a Device</Text>
                    </TouchableOpacity>}
                    <View style={styles.hr}/>
                    <TouchableOpacity onPress={this._signout.bind(this)} style={[styles.menuItem, { marginBottom: 20 * vh }]}>
                        <Ionicons size={24} color="white" name="md-key" style={{ marginRight: 2 * vw }}/>
                        <Text numberOfLines={1} style={[styles.normalText, styles.whiteText]}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
        )
    }

    _account() {
        Animated.timing(this.state.fadeValue, {
            toValue: 0,
            duration: 600,
            asing: Easing.cubic,
            useNativeDriver: true,
        }).start(() => {this.setState({ toggleWidth: 0 * vw })})
        this.setState({ isClosed: true })
        this.props.navigation.navigate('Account')
    }

    _wizard() {
        Animated.timing(this.state.fadeValue, {
            toValue: 0,
            duration: 600,
            asing: Easing.cubic,
            useNativeDriver: true,
        }).start(() => {this.setState({ toggleWidth: 0 * vw })})
        this.setState({ isClosed: true })
        this.props.navigation.navigate('Wizard')
    }

    _order() {
        Animated.timing(this.state.fadeValue, {
            toValue: 0,
            duration: 600,
            asing: Easing.cubic,
            useNativeDriver: true,
        }).start(() => {this.setState({ toggleWidth: 0 * vw })})
        this.setState({ isClosed: true })
        Linking.openURL(`mailto:sales@drainsensei.com?subject=[Order]&body=Please describe your order, and we will respond to you in a timely manner: `)
    }

    _menu() {
        if (this.state.isClosed) {
            this.setState({ toggleWidth: 100 * vw })
            Animated.timing(this.state.fadeValue, {
                toValue: 0.8,
                duration: 700,
                asing: Easing.cubic,
                useNativeDriver: true,
            }).start();
            this.setState({ isClosed: false })
        } else {
            Animated.timing(this.state.fadeValue, {
                toValue: 0,
                duration: 600,
                asing: Easing.cubic,
                useNativeDriver: true,
            }).start(() => {this.setState({ toggleWidth: 0 * vw })})
            this.setState({ isClosed: true })
        }
    }

    _signout() {
        Auth.signOut()
            .then(() => this.props.navigation.navigate('Login'))
            .catch(error => console.error(error));
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }
}

export default withNavigation(HomeNav);