import React, { Component } from 'react';
import {View } from 'react-native'
import firebase from 'react-native-firebase'
import {ListItem} from 'react-native-elements'


class Ask_team_list extends Component {
    constructor(props){
        super(props)
        this.state = {
            uid : '',
            team_name : []
        }
    }

    componentDidMount = () => {
        const user = firebase.auth().currentUser
        const uid = user.uid
        firebase.database().ref('users/'+ uid + '/joinlist').on('value',snap =>{
                snap.forEach(child => {
                    this.setState({
                        team_name : this.state.team_name.concat(child)                    })
                })
        })
    }

    render() {
        const { team_name } = this.state
        return (
            <View>
                {
                    team_name.map((list,i) => (
                        <ListItem
                            key = {i}
                            title={list.key}
                        />
                    ))
                }
            </View>
        );
    }
}

export default Ask_team_list;