import React, { Component } from 'react';
import { View, Text, TextInput, Button} from 'react-native'
import firebase from 'react-native-firebase'
import moment from 'moment-timezone'

class NoticeWrite extends Component {
    constructor(props){
        super(props)
        this.state ={
            title : '',
            article : ''
        }
    }

    submit(){
        const date = moment.tz('Asia/Seoul').format('YYYY년 MM월 DD일')

        firebase.database().ref('notice').push({
            title : this.state.title,
            article : this.state.article,
            date : date
        })
    }

    render() {
        return (
            <View>
            <TextInput
                placeholder='title'
                onChangeText={(text) => this.setState({title : text})}
                value={this.state.title}
            />
            <TextInput
                placeholder='article'
                onChangeText={(text) => this.setState({article : text})}
                value={this.state.article}
            />
            <Button
                title='submit'
                onPress={() => this.submit()}
            />
            </View>
        );
    }
}

export default NoticeWrite;