import React, { Component } from 'react';
import {View ,Platform, Image} from 'react-native'
import { Header } from 'react-native-elements'
import {withNavigation} from 'react-navigation'
import firebase from 'react-native-firebase'

class CustomHeader extends Component {
    
    render() {
        const {title, rightHeader, leftHeader} = this.props
        const Banner = firebase.admob.Banner;
        const AdRequest = firebase.admob.AdRequest;
        const request = new AdRequest();
    
        return (
            <View>
            <Header
                    leftComponent ={leftHeader}
                    rightComponent ={rightHeader}
                    backgroundColor = "#1c7ed6"
                    outerContainerStyles={{
                        justifyContent : 'center',
                    }}
                    innerContainerStyles={{
                        alignItems : 'center',
                        justifyContent : 'center'
                    }}
                    containerStyle ={{
                        marginTop : Platform.OS ==='ios' ? 0 : -30,
                        justifyContent : 'center',
                        alignItems : 'center',
                        paddingTop : 30,
                        height : 75
                    }}
                />
                <Banner
                    unitId='ca-app-pub-3940256099942544/6300978111'
                    size={'SMART_BANNER'}
                    request={request.build()}
                    onAdLoaded={() => {
                    console.log('Advert loaded');
                    }}
                />
            </View>
        );
    }
}

export default withNavigation(CustomHeader);