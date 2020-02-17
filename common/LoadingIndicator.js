import React, { Component } from 'react';
import { View, ActivityIndicator} from 'react-native'
class LoadingIndicator extends Component {
    render() {
        return (
            <View style={{flex : 1,alignItems : 'center', justifyContent : 'center'}}>
                <ActivityIndicator size="large"/>
            </View>
        );
    }
}

export default LoadingIndicator;