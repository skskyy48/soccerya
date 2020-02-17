import React, { Component } from 'react';
import {View , Text , TextInput} from 'react-native'
import firebase from 'react-native-firebase'
import {Button } from 'react-native-elements'
import {withNavigation } from 'react-navigation'
import CustomgoBackHeader from '../../../common/CustomgoBackHeader'


class MyInfo extends Component {
    constructor(props){
        super(props)
        this.state = {
            email : '',
            name : '',
            age : '',
            nickname : '',
            uid : ''
        }
    }


    componentDidMount = () => {
        const user = firebase.auth().currentUser
        this.setState({
            name : user.displayName,
            email : user.email,
            uid : user.uid
        })
    }

    static navigationOptions = ({navigation}) => ({
        header : <CustomgoBackHeader title='회원 정보 수정' navigation={()=> navigation.goBack()} />
    })

    _onSetUser = async () => {
        const {email, name, age, nickname, uid } = this.state
        try{
        await firebase.database().ref('users/' + uid).update({
            uid : uid,
            name : name,
            email : email,
            age : age,
            nickname : nickname
        })
        this.props.navigation.navigate('Home',)
        }catch(e){
            return
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
                    <Text style={{width : 70}}>별명 </Text>
                <TextInput
                        style = {{ width : 200 }}
                        onChangeText={(nickname) => this.setState({nickname})}
                        placeholder = "별명"
                />
                </View>
                </View>
                <View style={{flex : 1, alignItems : 'center',justifyContent : 'center'}}>
                <Button 
                    buttonStyle = {{width : 150, borderRadius : 0, backgroundColor : '#6741d9',alignItems : 'flex-end'}}
                    title = "확인"
                    onPress = {this._onSetUser}
                />
                </View>
            </View>
        );
    }
}

export default withNavigation(MyInfo);