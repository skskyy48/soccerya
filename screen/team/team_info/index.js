import React, { Component } from 'react';
import {View, Text, StyleSheet,ScrollView, TouchableOpacity, Platform } from 'react-native'
import firebase from 'react-native-firebase'
import CustomgoBackHeader from '../../../common/CustomgoBackHeader'
import { Avatar, ListItem, Overlay, Button } from 'react-native-elements'
import ImagePicker from 'react-native-image-crop-picker'
import Icon from 'react-native-vector-icons/FontAwesome'
import IconEn from 'react-native-vector-icons/Entypo'
import LottieView from 'lottie-react-native'
import RNFetchBlob from 'react-native-fetch-blob'

const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

class Team_info extends Component {
    static navigationOptions = ({navigation}) => ({
        header : <CustomgoBackHeader title={navigation.getParam('name')} navigation={()=> navigation.goBack()} />
    })
    constructor(props){
        super(props)
        this.state = {
            team_name : '',
            team_area : '',
            team_captain : '',
            team_info : '',
            team_date : '',
            captain_uid : '',
            team_member : ['asd'],
            admin : false,
            url : 'default',
            visible : false,
            user_uid : '',
            list : [''],
            key : '',
            team_key : '',
            blob : ''
        }
    }

    componentDidMount = async () => {
        const user = firebase.auth().currentUser
        const user_uid = user.uid
        const team_name = this.props.navigation.getParam('name')
        await firebase.database().ref('teams/').orderByChild('team_name').equalTo(team_name).on('value',snap => {
            snap.forEach(child => {
            this.setState({
                team_name : team_name,
                team_area : child.val().team_area,
                team_info : child.val().team_info,
                team_date : child.val().date,
                team_captain : child.val().team_captain,
                team_member : child.val().team_member,
                url : child.val().url,
                list : [],
                user_uid : user_uid,
                team_key : child.key,
                recruit : child.val().recruit
            })
            if(child.val().captain_uid === user_uid){
                this.setState({
                    admin : true
                })
            }
            })
        })

        await firebase.database().ref('joinList/'+ team_name).orderByChild('user_uid').on('value',snap => {
            snap.forEach(child => {
                this.setState({ 
                    list : this.state.list.concat(child.val())})
            })
            
        })

    }

    withdraw = async () => {
        const member = []
        await this.state.team_member.forEach( child =>{
            if(child === this.state.user_uid)
                child = null
            else
                member.push(child)
        })

        await firebase.database().ref('teams/' + this.state.team_key).update({
            team_member : member
        })

        await firebase.database().ref('users/'+ this.state.user_uid + '/teams').orderByChild("team_name").equalTo(this.state.team_name).once("value",sanp => {
            sanp.forEach(child => {
                if(this.state.team_name == child.val().team_name){
                    this.setState({ key : child.key})
                }
            })    
        })

        await firebase.database().ref('users/'+ this.state.user_uid + '/teams').child(this.state.key).remove()

        this.props.navigation.navigate('Team_Stack')
    }

    openPicker = async (team_name) =>{
        await ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping : true,
          }).then(image => {
            firebase.storage().ref('logo/'+ team_name).child('/logo.jpg').putFile(image.path)
            .then((snap) => {
                this.setState({url : snap.downloadURL})
                firebase.database().ref('teams/' + this.state.team_key).update({url : snap.downloadURL})
            }
            ).catch((error) => {
                console.log(error)
            })
        })
    }

    recruit(team_key){
        if(this.state.admin){
            firebase.database().ref('teams/' + team_key).update({
                recruit : !this.state.recruit
            })
            this.setState({recruit : !this.state.recruit})
        }
    }

    render() {
        const team_name = this.props.navigation.getParam('name')
        return (
            <View style={styles.container}>
                <ScrollView>
                <View style={styles.logo_container}>
                    <View style={styles.avartar_container}>
                        <View>
                        {this.state.admin ? 
                            <Avatar
                            rounded
                            size ='large'
                            onPress={() => this.openPicker(team_name)}
                            source={{uri: this.state.url}}
                            showEditButton
                        /> : 
                        <Avatar
                            rounded
                            size ='large'
                            source={{uri: this.state.url}}
                        />
                        }
                        
                        </View>
                    </View>
                </View>
                <View style={{borderColor : '#ced4da',backgroundColor : '#fff',padding : 7, backgroundColor : '#A9D0F5'}}>
                    <Text style={{paddingLeft : 15, fontFamily : 'netmarbleM', fontSize : 14, color:'#fff'}}>팀 정보</Text>
                </View>
                <View style ={{flex : 1,flexDirection : 'row', marginTop : 20, marginBottom : 20}}>
                    <View style={{ flex : 2, alignItems : 'center'}}>
                        <Text style={styles.info_text_title}>팀 이름</Text>
                        <Text style={styles.info_text_title}>주장 </Text>
                        <Text style={styles.info_text_title}>팀원 수</Text>
                        <Text style={styles.info_text_title}>팀 지역</Text>
                        <Text style={styles.info_text_title}>팀 소개</Text>
                        <Text style={styles.info_text_title}>팀원 모집</Text>
                    </View>
                    <View style={{ flex : 5}}>
                      <Text style={styles.info_text}>{this.state.team_name}</Text>
                        <Text style={styles.info_text}>{this.state.team_captain}</Text>
                        <Text style={styles.info_text}>{this.state.team_member.length}</Text>
                        <Text style={styles.info_text}>{this.state.team_area}</Text>
                        <Text style={styles.info_text}>{this.state.team_info}</Text>
                        <TouchableOpacity
                            onPress={()=>this.recruit(this.state.team_key)}
                        >
                        {
                            this.state.recruit ? 
                            <LottieView
                                source='recruit.json'
                                style={{width : 30, height : 30}}
                                autoPlay
                                loop/> : 
                                <Icon name='circle-o' size={18} style={{marginLeft : 10, margin : 7}}/>
                        }
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{borderColor : '#ced4da',backgroundColor : '#fff',padding : 7, backgroundColor : '#A9D0F5'}}>
                    <Text style={{paddingLeft : 15, fontFamily : 'netmarbleM', fontSize : 14, color:'#fff'}}>팀 메뉴</Text>
                </View>
                <View style={styles.button_container}>
                    <ListItem 
                    containerStyle = {{padding : 10,paddingLeft : 15, borderTopWidth : 0.5, alignItems : 'center',justifyContent : 'center'}}
                    titleStyle = {{fontSize : 15, fontFamily : 'netmarbleM'}}
                    title='팀 채팅'
                    leftIcon = {<IconEn name='chat' size={20} color="#2E64FE" />}
                    onPress = {() => this.props.navigation.navigate('Team_chat',{
                        team_name : this.state.team_name
                    })}
                    />
                    <ListItem 
                    containerStyle = {{padding : 10,paddingLeft : 15, borderTopWidth : 0.5, alignItems : 'center'}}
                    titleStyle = {{fontSize : 15, fontFamily : 'netmarbleM'}}
                    title='경기 일정'                         
                    rightIcon = {<Icon name='chevron-right' size={20} color="#ced4da" />}
                    onPress = {() => this.props.navigation.navigate('Team_match',{
                        name : this.state.team_name
                    })}
                    />
                    <ListItem 
                    containerStyle = {{padding : 10,paddingLeft : 15, borderTopWidth : 0.5, alignItems : 'center'}}
                    titleStyle = {{fontSize : 15, fontFamily : 'netmarbleM'}}
                    title='매칭 관리'                         
                    rightIcon = {<Icon name='chevron-right' size={20} color="#ced4da" />}
                    onPress = {() => this.props.navigation.navigate('Match_admin',{
                        name : this.state.team_name,
                        admin : this.state.admin,
                        key : this.state.team_key
                    })}
                    />
                    {this.state.admin ? <View><ListItem 
                    containerStyle = {{padding : 10,paddingLeft : 15, borderTopWidth : 0.5, alignItems : 'center'}}
                    titleStyle = {{fontSize : 15, fontFamily : 'netmarbleM'}}
                    title='신청 목록'                         
                    rightIcon = {<Icon name='chevron-right' size={20} color="#ced4da" />}
                    badge={{value : this.state.list.length , textStyle : {color : '#fff'} , status : 'error', size : 40 }}
                    badgeStyle = {{ width : 30}}
                    onPress = {() => this.props.navigation.navigate('Ask_list', {
                        name : this.state.team_name
                    })}
                    />
                    <ListItem 
                    containerStyle = {{padding : 10,paddingLeft : 15, borderTopWidth : 0.5, alignItems : 'center'}}
                    titleStyle = {{fontSize : 15, fontFamily : 'netmarbleM'}}
                    title='팀원 관리'                         
                    rightIcon = {<Icon name='chevron-right' size={20} color="#ced4da" />}
                    onPress = {() => this.props.navigation.navigate('Member_admin', {
                        list : this.state.team_member,
                        name : this.state.team_name
                    })}
                    />
                    
                    </View>: <View>
                    <ListItem 
                    containerStyle = {{padding : 10,paddingLeft : 15, borderTopWidth : 0.5, alignItems : 'center', backgroundColor : '#FBFAF9'}}
                    titleStyle = {{fontSize : 15, color: 'red', fontFamily : 'netmarbleM'}}
                    title='탈퇴'                         
                    rightIcon = {<Icon name='chevron-right' size={20} color="#ced4da" />}
                    onPress = {() => this.setState({visible : true})}
                    />
                    <View style={{ alignItems : 'center'}}>
                <Overlay
                    isVisible = {this.state.visible}
                    onBackdropPress = {() => this.setState({visible : false})}
                    width={300}
                    height={100}
                >
                <View>
                <Text style={{margin : 10, fontFamily : 'netmarbleM'}}> 정말로 탈퇴하시겠습니까?</Text>
                <Button
                    onPress={() => this.withdraw()}
                    title = "확인"
                />
                </View>
                </Overlay>
                </View>
                    </View>}
        
                </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1
    },
    avartar_container : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
        flexDirection : 'column',
        marginBottom : 20,
        marginTop : 20,
        padding : 10,
    },
    logo_container : {
        flex : 1,
    },
    info_container : {
        flex: 1,
        marginTop : 30,
        marginBottom : 30
    },
    button_container : {
        flex : 1,
        padding : 15,
        paddingTop : 0
    },
    info_text : {
        margin : 7,
        marginLeft : 10,
        fontSize : 14,
        fontFamily : 'netmarbleL'
    },
    info_text_title : {
        margin : 7,
        marginLeft : 20,
        fontSize : 14,
        fontFamily : 'netmarbleB'
    }
})

export default Team_info;