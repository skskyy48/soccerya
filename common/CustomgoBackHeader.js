import React, { Component } from 'react';
import {View, StyleSheet , Platform} from 'react-native'
import { Header } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'

class CustomgoBackHeader extends Component {
    
    render() {
        const {title, navigation} = this.props
        return (
            <Header
                    leftComponent ={<Icon name='arrow-left' color='#fff' size={22} onPress ={navigation}/>}
                    centerComponent={{ text: title, style: { color: '#fff', fontSize : 20, justifyContent : 'center'} }}
                    backgroundColor = "#1c7ed6"
                    outerContainerStyles={{
                        justifyContent : 'center',
                    }}
                    innerContainerStyles={{
                        alignItems : 'center'
                    }}
                    containerStyle ={{
                        marginTop : Platform.OS ==='ios' ? 0 : -30,
                        paddingTop : 30,
                        height : 75
                    }}
                />
        );
    }
}

export default CustomgoBackHeader;