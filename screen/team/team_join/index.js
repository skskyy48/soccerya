import React, { Component } from 'react';
import { View  , StyleSheet, Dimensions, Text,TextInput } from 'react-native'
import firebase from 'react-native-firebase'
import {withNavigation} from 'react-navigation'
import CustomgoBackHeader from '../../../common/CustomgoBackHeader'
import moment from 'moment-timezone'
import { Button,Avatar,Overlay,CheckBox } from 'react-native-elements'

const width = Dimensions.get('window').width

class Team_Join extends Component {
    static navigationOptions = ({navigation}) => ({
        header : <CustomgoBackHeader title={navigation.getParam('name')} navigation={()=> navigation.goBack()} />
    })
    constructor(props){
        super(props)
        this.state = {
            name : '',
            area : '',
            info : '',
            captain : '',
            uid : '',
            join : false,
            child : '',
            user_name : '',
            user_age : '',
            user_nickname : '',
            user_email : '',
            team_member : [],
            create_date : '',
            captain_uid : '',
            item : null,
            visible : false,
            user_height : '',
            user_kg : '',
            user_info : '',
            info_agree : false
        }
    }

    componentDidMount= async () => {
        const user = firebase.auth().currentUser
        const useruid = user.uid
        await firebase.database().ref('users/'+ useruid ).once('value',snap => {
            this.setState({
                user_name : snap.val().name,
                user_age : snap.val().age,
                user_nickname : snap.val().nickname,
                user_email : snap.val().email
            })
        })

        this.setState({item : this.props.navigation.getParam('item'), uid : useruid})
        
        await firebase.database().ref('joinList/'+ this.props.navigation.getParam('name')).orderByChild("user_uid").equalTo(useruid).once("value",sanp => {
            sanp.forEach(child => {
                if(useruid == child.val().user_uid){
                    this.setState({ join : true, child : child.key})
                }
            })    
        })
    }

    _onJoin = async () => {
        const { name, uid, user_name, user_age, user_email, user_nickname, item, captain_uid,user_info, user_height,user_kg} = this.state
        const date = moment.tz('Asia/Seoul').format('MM DD HH:mm')
        await firebase.database().ref('joinList/'+ item.team_name ).push({
                user_uid : uid,
                age : user_age,
                email : user_email,
                nickname : user_nickname,
                date : date,
                captain_uid : item.captain_uid,
                user_kg : user_kg,
                user_height : user_height,
                user_info : user_info
            })
            await firebase.database().ref('users/'+ uid + '/joinlist/'+ item.team_name).set({
                    uid : this.state.uid,
                    check : 'spinner'
            })
            this.setState({ join : true, visible : false})
            this.props.navigation.navigate('TeamStack')
    }

    _onJoinCancle = async () => {

        await firebase.database().ref('joinList/'+ this.state.item.team_name).child(this.state.child).remove()
        await firebase.database().ref('users/' + this.state.uid + '/joinlist/'+ this.state.item.team_name ).remove()
        this.setState({ join : false})

    }

    render() {

        const { area, captain, info, join, team_member, create_date } = this.state
        const item = this.props.navigation.getParam('item')
        return (
            <View style={styles.container}>
                <View style={styles.info_form}>
                    <View style={styles.info_title}>
                        <View>
                        <Avatar
                            rounded
                            size ='large'
                            source={{uri: item.url}}
                        />
                        </View>
                        <View style={{marginTop : 20, justifyContent : 'flex-end'}}>
                            <Text style={{ fontFamily : 'netmarbleB'}}>{item.team_name}</Text>
                        </View>
                    </View>
                    <View style ={{flex : 2,flexDirection : 'row', alignItems : 'center'}}>
                        <View style={{ flex : 2, alignItems : 'center'}}>
                            <Text style={styles.info_text_title}>팀 이름</Text>
                            <Text style={styles.info_text_title}>팀원 수</Text>
                            <Text style={styles.info_text_title}>팀장</Text>
                            <Text style={styles.info_text_title}>팀 지역</Text>
                            <Text style={styles.info_text_title}>팀 생성일</Text>
                            <Text style={styles.info_text_title}>팀 소개</Text>
                        </View>
                        <View style={{ flex : 5}}>
                            <Text style={styles.info_text_sub}>{item.team_name}</Text>
                            <Text style={styles.info_text_sub}>{item.team_member.length}</Text>
                            <Text style={styles.info_text_sub}>{item.team_captain}</Text>
                            <Text style={styles.info_text_sub}>{item.team_area}</Text>
                            <Text style={styles.info_text_sub}>{item.date}</Text>
                            <Text style={styles.info_text_sub}>{item.team_info}</Text>
                        </View>
                    </View>
                </View>
                <View style={{flex : 1,flexDirection : 'row', alignItems : 'flex-end',justifyContent : 'center'}}>
                <Button
                        buttonStyle = {{width : width/2, borderRadius : 0, backgroundColor : '#ffc078'}}
                        title = "메세지"
                        onPress = {() => this.props.navigation.navigate('Chat',{receiver : this.state.item.captain_uid})}
                    />
                {join? <Button
                        buttonStyle = {{width : width/2, borderRadius : 0, backgroundColor : '#f03e3e'}}
                        title = "취소"
                        onPress = {this._onJoinCancle}
                    /> 
                : <Button
                        buttonStyle = {{width : width/2, borderRadius : 0, backgroundColor : '#6741d9'}}
                        title = "신청"
                        onPress = {() => this.setState({ visible : true})}
                    />}
                </View>

                <Overlay
                    isVisible={this.state.visible}
                    width ="auto"
                    height = "auto"
                    onBackdropPress={() => this.setState({visible : false})}
                    containerStyle={{padding : 0}}
                    overlayStyle={{padding :0 }}
                >
                    <View>
                        <View style={{marginTop : 10,padding : 10}}>
                            <View style={{flexDirection : 'row', alignItems : 'center'}}>
                                <Text style={{marginRight : 5}}>내 프로필</Text>
                                <TextInput
                                    onChangeText={(text) => this.setState({ user_height : text})}
                                    placeholder="cm"
                                    value={this.state.user_height}
                                    editable={!this.state.info_agree}
                                />
                                <Text>cm</Text>

                                <TextInput
                                    onChangeText={(text) => this.setState({ user_kg : text})}
                                    placeholder="kg"
                                    value={this.state.user_kg}
                                    editable={!this.state.info_agree}
                                />
                                <Text>kg</Text>

                                <CheckBox
                                    title="비공개"
                                    checked={this.state.info_agree}
                                    onPress={() => this.setState({ info_agree : !this.state.info_agree})}
                                    size ={20}
                                    containerStyle={{backgroundColor : '#fff', borderWidth : 0}}
                                />
                            </View>
                            <View style={{marginTop : 5}}>
                                <Text>자기 소개</Text>
                                <TextInput
                                    onChangeText={(text) => this.setState({ user_info : text})}
                                    placeholder="간단한 자기소개"
                                    multiline
                                />
                            </View>
                        </View>
                        <View>
                            <Button
                               buttonStyle = {{ borderRadius : 0, backgroundColor : '#6741d9'}}
                               title = "신청"
                               onPress = {() => this._onJoin()}
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
        flex : 1
    },
    info_form : {
        flex : 7,
        alignItems : 'stretch',
    },
    button : {
        justifyContent : 'center',
        margin : 30,
        alignItems : 'flex-end',
        flexDirection : 'row'
    },
    text_style : {
        fontSize : 16,
        fontFamily : 'netmarbleL'
    },
    text_title : {
        fontSize : 22,
        fontFamily : 'netmarbleB'
    },
    info_text : {
        flex : 9,
        marginTop : 40,
        marginLeft : 30,
        alignItems : 'flex-start'
    },
    info_title : {
        flex : 1,
        alignItems : 'center',
        justifyContent : 'center',
        borderBottomWidth : 0.6,
        borderColor : '#adb5bd',
    },
    icon_text : {
        flexDirection : 'row',
        margin : 15,

    },
    button_style : {
        width : (width-50), 
        borderRadius : 0, 
        backgroundColor : '#FF0080'
    },
    info_text_sub : {
        margin : 7,
        marginLeft : 20,
        fontSize : 15,
        fontFamily : 'netmarbleL'
    },
    info_text_title : {
        margin : 7,
        marginLeft : 20,
        fontSize : 15,
        fontFamily : 'netmarbleB'
    }

})


export default withNavigation(Team_Join);