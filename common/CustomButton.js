import React, { Component } from 'react';
import {Dimensions} from 'react-native'
import {Button } from 'react-native-elements'

const width = Dimensions.get('window').width

class CustomButton extends Component {
    render() {
        const {title, onPress, loading} = this.props
        return (
            <Button
                title = {title}
                color = '#1c7ed6'
                onPress = {() => onPress}
                style = {{width : width, marginTop : 20 ,justifyContent : 'flex-end'}}
                loading = {loading}
            />

        );
    }
}

export default CustomButton;