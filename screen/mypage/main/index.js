import React, { Component } from 'react';
import { View , Text , StyleSheet, Alert} from 'react-native'
import firebase from 'react-native-firebase'
import {ListItem, Avatar } from 'react-native-elements'
import { withNavigation} from 'react-navigation'

class Main extends Component {
    constructor(props){
        super(props)
        this.state = {
            name : '',
            email : '',
            photoUrl : 'default',

        }
    }

    componentDidMount = () => {
        this.getUserInfo()
    }

    getUserInfo = ()=> {
        const user = firebase.auth().currentUser
        if(user != null){
            this.setState({
                name : user.displayName,
                email : user.email,
                photoUrl : user.photoURL
            })
        }
    }

    logout = () => {
        firebase.auth().signOut().then(function() {
            this.props.navigation.navigate('Auth')
          }).catch(function(error) {
            return;
          });
    }

    deleteInfo(){
        var user = firebase.auth().currentUser
        firebase.database().ref('users/' + user.uid).remove()
        user.delete().then(() => {
            this.navigation.navigate('Auth_Stack')
        })
    }

    withdraw = () => {

        Alert.alert(
            '회원 탈퇴',
            '정말로 탈퇴 하시겠습니까?',
            [
              {text: '네', onPress: () => this.deleteInfo()},
              {
                text: '아니오',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
            ],
            {cancelable: false},
          );

        
    }

    render() {
        const { name , email, photoUrl } = this.state
        return (
            <View style={styles.container}>
                <View style={styles.avatar}>
                    <Avatar size={64} source = {{uri : photoUrl }}/>
                        <View style={styles.avatar_text}>
                            <Text style={{fontFamily : 'handon'}}>{name}</Text>
                            <Text style={{fontFamily : 'handon'}}>{email}</Text>
                        </View>
                </View>
                <View style={styles.buttons}>
                    <ListItem 
                    containerStyle = {{padding : 10, borderTopWidth : 0.5, alignItems : 'center'}}
                    titleStyle = {{fontSize : 15, fontFamily : 'netmarbleM'}}
                    title='내 정보 수정'
                    chevron                         
                    onPress = {() => this.props.navigation.navigate('MyInfo')}
                    />
                    <ListItem 
                    containerStyle = {{padding : 10, borderTopWidth : 0.5, alignItems : 'center',justifyContent : 'center'}}
                    titleStyle = {{fontSize : 15, fontFamily : 'netmarbleM'}}
                    title='내 팀 목록'
                    chevron
                    onPress = {() => this.props.navigation.navigate('MyTeam_list')}
                    />
                    <ListItem 
                    containerStyle = {{padding : 10, borderTopWidth : 0.5, alignItems : 'center'}}
                    titleStyle = {{fontSize : 15, fontFamily : 'netmarbleM'}}
                    title='신청 목록'  
                    chevron                       
                    onPress = {() => this.props.navigation.navigate('Ask_team_list',)}
                    />
                    <View style={{marginTop : 20}}>
                    <ListItem 
                    containerStyle = {{padding : 10, borderTopWidth : 0.5, alignItems : 'center'}}
                    titleStyle = {{fontSize : 15, fontFamily : 'netmarbleM'}}
                    title='1:1 문의'  
                    chevron                       
                    onPress = {() => this.props.navigation.navigate('Inquire')}
                    />
                    <ListItem 
                    containerStyle = {{padding : 10, borderTopWidth : 0.5, alignItems : 'center'}}
                    titleStyle = {{fontSize : 15, fontFamily : 'netmarbleM',color : '#f03e3e'}}
                    title='로그 아웃'                         
                    onPress = {() => this.logout()}
                    />
                    </View>
                    <View style={{marginTop : 20}}>
                    <ListItem 
                    containerStyle = {{padding : 10, borderTopWidth : 0.5, alignItems : 'center'}}
                    titleStyle = {{fontSize : 15, fontFamily : 'netmarbleM',color : '#f03e3e'}}
                    title='회원 탈퇴'                         
                    onPress = {() => this.withdraw()}
                    />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1
    },
    avatar : {
        flex : 1,
        flexDirection : 'row',
        margin : 25,
        justifyContent : 'center',
        alignItems : 'center'
    },
    avatar_text : {
        flex : 1,
        margin : 5,
        justifyContent : 'center',
        marginLeft : 15
    },
    buttons : {
        flex : 8,
        margin : 20,
        marginTop : 40
    }
})

export default withNavigation(Main);