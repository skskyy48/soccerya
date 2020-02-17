import React, { Component } from 'react';
import { View,FlatList} from 'react-native'
import firebase from 'react-native-firebase'
import {ListItem } from 'react-native-elements'
import CustomgoBackHeader from '../../../common/CustomgoBackHeader'

class chatList extends Component {
    constructor(props){
        super(props)
        this.state = {
            chat_list : [],
            info : []
        }
    }

    componentDidMount = async() => {
        const uid = firebase.auth().currentUser.uid
        await firebase.database().ref('users/' + uid + '/chat').once('value',snap => {
            this.setState({info : [],chatList : []})
            snap.forEach(child => {
                firebase.database().ref('users/' + child.val().uid).on('value',snap => {
                    const info = {
                        name : snap.val().nickname,
                        url : snap.val().photoURL,
                        uid : child.val().uid
                    }
                    this.setState({info : this.state.info.concat(info)})
                })
            })
        })
    }

    static navigationOptions = ({navigation}) => ({
        header : <CustomgoBackHeader title='메세지' navigation={()=> navigation.goBack()} />
    })

    getUser(){
        this.state.chat_list.map((data,i) => {
            firebase.database().ref('users/' + data.uid).on('value',snap => {
                const info = {
                    name : snap.val().nickname,
                    url : snap.val().photoURL
                }
                this.setState({info : this.state.info.concat(info)})
            })
        })
    }

    render() {
        return (
            <View>
                <FlatList
                    data = {this.state.info}
                    showsVerticalScrollIndicator= {false}
                    keyExtractor = {item => item.name}
                    renderItem={({item}) =>
                    <ListItem
                        containerStyle = {{ padding : 8, marginLeft : 15, marginRight : 15}}
                        style ={{ borderBottomWidth : 1, borderColor : '#CED0CE'}}
                        title = {item.name}
                        titleStyle = {{fontSize : 14, fontFamily : 'netmarbleM'}}
                        leftAvatar = {{source : {uri : item.url}}}     
                        onPress = {() => this.props.navigation.navigate('Chat',{receiver : item.uid,name : item.name, url : item.url})}                  
                    />
                }
                />

            </View>
        );
    }
}

export default chatList;