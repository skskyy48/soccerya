import React, { Component } from 'react';
import { View , Text } from 'react-native'
import firebase from 'react-native-firebase'
import User_info from '../ask_list/user_info'
import CustomgoBackHeader from '../../../../../common/CustomgoBackHeader'


class Ask_list extends Component {
    static navigationOptions = ({navigation}) => ({
        header : <CustomgoBackHeader title={navigation.getParam('name')} navigation={()=> navigation.goBack()} />
    })
    constructor(props){
        super(props)
        this.state = {
            list : []
        }
    }

    componentDidMount = () => {
        firebase.database().ref('joinList/'+ this.props.navigation.getParam('name')).orderByChild('user_uid').on('value',snap => {
            snap.forEach(child => {
                this.setState({ 
                    list : this.state.list.concat(child.val())})
            })
            
        })
    }

    render() {
        const { list } = this.state
        return (
            <View>
                {
                    list.map((list,i) => (
                        <User_info
                            key = {i}
                            name = {list.name}
                            age = {list.age}
                            email = {list.email}
                            nickname = {list.nickname}
                            date={list.date}
                            teamname = {this.props.navigation.getParam('name')}
                            user_uid = {list.user_uid}
                            user_kg = {list.user_kg}
                            user_height={list.user_height}
                            user_info = {list.user_info}
                        />
                    ))
                }
            </View>
        );
    }
}

export default Ask_list;