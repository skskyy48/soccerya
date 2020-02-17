import React, { Component } from 'react';
import { View, ActivityIndicator} from 'react-native'
import firebase from 'react-native-firebase'

class LoadingIndicator extends Component {
    
      componentWillMount() {
        this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
            this.props.navigation.navigate ( user ? 'Home' : 'Auth')
        });
    }

    render() {
        return (
            <View>
                <ActivityIndicator size="large"/>
            </View>
        );
    }
}

export default LoadingIndicator;