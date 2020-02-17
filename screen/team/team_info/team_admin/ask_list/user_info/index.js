import React, { Component } from 'react';
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native'
import firebase from 'react-native-firebase'
import { withNavigation} from 'react-navigation'
import moment from 'moment'
import { Overlay,ListItem,Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

class User_info extends Component {
    constructor(props){
        super(props)
        this.state = {
            member : [],
            team_name : this.props.teamname,
            child : '',
            visible : false,
            check : false,
            date : '',
            key : ''
        }
    }

    componentDidMount = () => {
        firebase.database().ref('teams').orderByChild('team_name').equalTo(this.state.team_name).on('value',snap => {
            snap.forEach(child => {
                this.setState({ member : child.val().team_member, key : child.key})
            })
        })
    
        
    }

    addMemeber = async (user_uid, teamname, visible) => {
        await firebase.database().ref('teams/'+ this.state.key).update({
            team_member : this.state.member.concat(user_uid)
        })

        await firebase.database().ref('joinList/'+ teamname).orderByChild("user_uid").equalTo(user_uid).once("value",sanp => {
            sanp.forEach(child => {
                if(user_uid == child.val().user_uid){
                    this.setState({ child : child.key})
                }
            })    
        })
        await firebase.database().ref('users/' + user_uid +'/joinlist/' + teamname).remove()
        await firebase.database().ref('users/' + user_uid +'/teams').push({
            admin : false,
            team_name : teamname
        })

        await firebase.database().ref('joinList/' + teamname + '/' + this.state.child).remove()
        this.setState({ visible : visible, check : true})   
    }

    reject = async (user_uid, teamname, visible) => {
        await firebase.database().ref('joinList/'+ teamname).orderByChild("user_uid").equalTo(user_uid).once("value",sanp => {
            sanp.forEach(child => {
                if(user_uid == child.val().user_uid){
                    this.setState({ child : child.key})
                }
            })    
        })

        await firebase.database().ref('joinList/' + teamname + '/' + this.state.child).remove()

        await firebase.database().ref('users/' + user_uid +'/joinlist/' + teamname).remove()
        this.setState({ visible : visible, check : true}) 
    }

    render() {
        const {name, email, age, nickname, teamname, user_uid,date,user_kg, user_height,user_info} = this.props
        {
            moment.updateLocale('en',{
                relativeTime : {
                    future : "%s 후",
                    past : "%s 전",
                    s  : 'a few seconds',
                    ss : '%d seconds',
                    m:  "1분",
                    mm: "%d분",
                    h:  "1시간",
                    hh: "%d시간",
                    d:  "1일",
                    dd: "%d일",
                    M:  "1달",
                    MM: "%d월",
                    y:  "1년",
                    yy: "%d년"
                }
            })
        }
        
        return (
            <View>
                {this.state.check ? 
                null
                : 
                <TouchableHighlight
                    onPress = {() => {this.setState({visible : true})}}
                >
                <View>
                <ListItem
                    containerStyle = {{ padding : 8, marginLeft : 10, marginRight : 10, marginTop : 5,borderRadius : 4}}
                    title = {nickname}
                    titleStyle = {{fontSize : 14, fontFamily : 'netmarbleM'}}
                    rightIcon = {<Icon name='chevron-right' size={20} color="#ced4da" />}
                    subtitle = {<View>
                            <View style={{ flexDirection : 'row',alignItems : 'center', marginTop : 5}}>
                            <Icon name='timer' size={14} style={{marginRight : 3}}/>
                            <Text style={{fontSize : 12,color : '#A4A4A4'}}>{moment(JSON.stringify(date),'MM DD HH:mm').fromNow()}</Text>
                            </View>
                        </View>}
                />
                </View>
                </TouchableHighlight>
                }
                <Overlay
                    isVisible={this.state.visible}
                    width={300}
                    height={200}
                    onRequestClose={() => this.setState({ visible : false})}
                    onBackdropPress={() => this.setState({ visible : false})}
                >
                    <View style={{flex : 1}}>
                    <View style={{padding : 5, paddingLeft : 15,paddingTop : 15}}>
                    <Text style ={{fontSize : 14, fontFamily : 'netmarbleM'}}>닉네임 : {nickname}</Text>
                    <Text style ={{fontSize : 14, fontFamily : 'netmarbleM'}}>나이 : {age}</Text>
                    <Text style ={{fontSize : 14, fontFamily : 'netmarbleM'}}>E-mail : {email}</Text>
                    {user_height && user_kg ? <Text style ={{fontSize : 14, fontFamily : 'netmarbleM'}}>프로필 : 키 {user_height}cm 몸무게 {user_kg}kg</Text>
                     : <Text style ={{fontSize : 14, fontFamily : 'netmarbleM'}}>프로필 : 비공개</Text>}
                    <Text style ={{fontSize : 14, fontFamily : 'netmarbleM'}}>자기소개 : {user_info}</Text>
                    </View>
                    <View style={{flexDirection : 'row', alignItems : 'flex-end',justifyContent : 'center',marginTop : 50}}>
                    <Button
                        onPress={() => this.reject(user_uid, teamname, !this.state.visible)}
                        title="거절"
                        buttonStyle={{width : 100,height : 40, borderRadius : 0, backgroundColor : '#f03e3e'}}
                    />
                    <Button
                        onPress={() => {this.props.navigation.navigate('Chat', { receiver : user_uid, name : nickname})
                        this.setState({visible : false})}}                        
                        title="메세지"
                        buttonStyle={{width : 100,height : 40, borderRadius : 0, backgroundColor : '#4263eb'}}
                    />
                    <Button
                        title = "수락"
                        onPress={() => this.addMemeber(user_uid, teamname, !this.state.visible)}
                        buttonStyle={{width : 100,height : 40, borderRadius : 0, backgroundColor : '#40c057'}}
                        />
                    </View>
                    </View>
                </Overlay>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        alignItems : 'center',
        padding : 100,
    },
    modal : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
        padding : 20
    },
    check_list : {
        backgroundColor : '#000000'
    }
})

export default withNavigation(User_info);