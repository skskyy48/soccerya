import React, { Component } from 'react';
import { View , Text,FlatList, ScrollView, Button} from 'react-native'
import firebase from 'react-native-firebase'
import CustomgoBackHeader from '../../../../../common/CustomgoBackHeader'
import { ListItem, Overlay } from 'react-native-elements'
import Icon  from 'react-native-vector-icons/FontAwesome'

class Member_admin extends Component {
    constructor(props){
        super(props)
        this.state = {
            age : '',
            nickname : '',
            user_list : [],
            visible : false,
            team_member : [],
            user_uid : '',
            key : ''
        }
    }
    static navigationOptions = ({navigation}) => ({
        header : <CustomgoBackHeader title={'팀원 관리'} navigation={()=> navigation.goBack()} />
    })

    withdraw = async () => {
        const member = []
        
        await this.state.team_member.forEach( child =>{
            if(child === this.state.user_uid)
                child = null
            else
                member.push(child)
        })

        await firebase.database().ref('teams/' + this.state.key).update({
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
        
        this.setState({visible : false})
    }

    componentDidMount =  () => {
        const useruid = firebase.auth().currentUser.uid
        const list = this.props.navigation.getParam('list')
        firebase.database().ref('teams' ).orderByChild('team_name').equalTo(this.props.navigation.getParam('name')).once('value',snap => {
            sanp.forEach(child => {
                this.setState({ team_member : child.val().team_member, team_name : child.val().team_name, key : child.key})
            })
        })

        list.forEach(uid => {
            if(uid != useruid)
             firebase.database().ref('users/' + uid ).once('value',snap => {
                this.setState({ user_list : this.state.user_list.concat(snap.val())})
            })
        });
    }

    render() {
        const list  = this.props.navigation.getParam('list')
        return (
            <View>
                <ScrollView>
                <FlatList
                    data = {this.state.user_list}
                    showsVerticalScrollIndicator= {false}
                    keyExtractor = {item => item.nickname}

                    renderItem={({item}) =>
                    <ListItem
                        style ={{ borderBottomWidth : 1, borderColor : '#CED0CE'}}
                        title = {item.nickname}
                        leftAvatar ={{source : {uri : item.photoURL}}}
                        rightIcon = {<Icon name='minus-circle' size={22} color = 'red' onPress={() => this.setState({visible : true, user_uid : item.uid})}/>}
                    />
                    }
                />
                </ScrollView>
                <View>
                <Overlay
                    isVisible = {this.state.visible}
                    onBackdropPress = {() => this.setState({visible : false})}
                    width={300}
                    height={100}
                >
                <View>
                <Text style={{margin : 10}}> 정말로 추방하시겠습니까?</Text>
                <Button
                    onPress={() => this.withdraw()}
                    title = "확인"
                />
                </View>
                </Overlay>
                </View>
            </View>
        );
    }
}

export default Member_admin;