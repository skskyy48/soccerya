import React, { Component } from 'react';
import {View , Text , TextInput,TouchableOpacity} from 'react-native'
import firebase from 'react-native-firebase'
import {Button,CheckBox } from 'react-native-elements'
import {withNavigation } from 'react-navigation'

class FirstUserModal extends Component {
    constructor(props){
        super(props)
        this.state = {
            email : '',
            name : '',
            age : '',
            nickname : '',
            uid : '',
            visible : true,
            agree : false
        }
    }

    static navigationOptions = ({navigation}) => ({
        header : null,
    })


    componentDidMount = () => {
        const user = firebase.auth().currentUser
        this.setState({
            name : user.displayName,
            email : user.email,
            uid : user.uid,
            photoURL : user.photoURL
        })
    }

    _onSetUser = () => {
        const {email, name, age, nickname, uid } = this.state
        firebase.database().ref('users/' + uid).update({
            uid : uid,
            name : name,
            email : email,
            age : age,
            nickname : nickname
        })
        this.initNotification();

        this.props.navigation.navigate('Home')
    }

    initNotification = async () => {
        const uid = firebase.auth().currentUser.uid
        await this.setPermission();
        const fcmToken = await firebase.messaging().getToken();
        firebase.database().ref('users/' + uid).update({ token : fcmToken})
        console.log('fcmToken', fcmToken);
      }
    
      setPermission = async () => {
        try {
          const enabled = await firebase.messaging().hasPermission();
          if (!enabled) {
            await firebase.messaging().requestPermission();
          }
        } catch (error) {
          console.log('error', error);
        }
      }

    render() {
        return (
            <View style={{flex:1}}>
                <View stlye={{flex : 10, padding : 20,justifyContent : 'center'}}>
                <View style={{flexDirection : 'row',margin : 20,marginLeft : 30,marginTop : 100,alignItems : 'center', justifyContent: 'flex-start'}}>
                    <Text style={{width : 70}}>이름 </Text>
                    <Text>{this.state.name}</Text>
                </View>
                <View style={{flexDirection : 'row',margin : 20,marginLeft : 30,alignItems : 'center', justifyContent: 'flex-start'}}>
                    <Text style={{width : 70}}>이메일 </Text>       
                    <Text>{this.state.email}</Text>
                </View>
                <View style={{flexDirection : 'row',margin : 20,marginLeft : 30,alignItems : 'center', justifyContent: 'flex-start'}}>
                    <Text style={{width : 70}}>나이 </Text>
                <TextInput
                        style = {{ width : 200 }}
                        onChangeText={(age) => this.setState({age})}
                        placeholder = "나이"
                />
                </View>
                <View style={{flexDirection : 'row',margin : 20,marginLeft : 30,alignItems : 'center', justifyContent: 'flex-start'}}>
                    <Text style={{width : 70}}>닉네임 </Text>
                <TextInput
                        style = {{ width : 200 }}
                        onChangeText={(nickname) => this.setState({nickname})}
                        placeholder = "닉네임"
                />
                </View>
                <View  style={{flexDirection : 'row',margin : 20,marginLeft : 30,alignItems : 'center', justifyContent: 'flex-start'}}>
                    <CheckBox
                        checked={this.state.agree}
                        onPress={() => this.setState({agree : !this.state.agree})}
                    />
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Privacy_policy')}>
                    <Text style={{color : '#206DCA'}}>개인정보 처리방침을 읽고 이에 동의합니다.</Text>
                    </TouchableOpacity>
                    
                </View>
                </View>
                <View style={{flex : 1, alignItems : 'center',justifyContent : 'center'}}>
                <Button 
                    buttonStyle = {{width : 150, borderRadius : 0, backgroundColor : '#6741d9',alignItems : 'flex-end'}}
                    title = "확인"
                    onPress = {this._onSetUser}
                    disabled={this.state.nickname === '' || this.state.age === '' || this.state.agree == false}
                />
                </View>
            </View>
        );
    }
}

export default withNavigation(FirstUserModal);