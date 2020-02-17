import React, { Component } from 'react';
import {View, Text, TouchableHighlight } from 'react-native'

class MyTeam extends Component {
    render() {
        return (
            <View>
                <TouchableHighlight
                 onPress = {() => this.props.navigation.navigate('MyTeam_list')}>
                    <Text>팀 목록</Text>
                </TouchableHighlight>
                <TouchableHighlight
                onPress = {() => this.props.navigation.navigate('Ask_team_list')}>
                    <Text>신청 목록</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

export default MyTeam;