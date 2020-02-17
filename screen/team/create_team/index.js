import React, { Component } from 'react';
import {View , StyleSheet,Text, Picker, ScrollView} from 'react-native'
import * as firebase from 'react-native-firebase'
import { Button } from 'react-native-elements'
import CustomgoBackHeader from '../../../common/CustomgoBackHeader'
import { Input, Avatar } from 'react-native-elements'
import moment from 'moment-timezone'
import ImagePicker from 'react-native-image-crop-picker'
import Icon from 'react-native-vector-icons/FontAwesome'

const city_list = ['서울특별시','경기도','인천광역시','강원도','충청남도','대전광역시','충청북도','부산광역시', '울산광역시','대구광역시','전라남도','전라북도','광주광역시','제주도','전체']

class Create_Team extends Component {
    static navigationOptions = ({navigation}) => ({
        header : <CustomgoBackHeader title='팀 만들기' navigation={()=> navigation.goBack()} />
    })
    constructor(props){
        super(props)
        this.state = {
            team_name : '',
            team_captain : '',
            team_area : '',
            team_info : '',
            team_member : [],
            check : true,
            color : '#1971c2',
            error : '',
            loading: false,
            dp: null,
            path : null,
            data : '',
            mime : '',
            url : 'https://firebasestorage.googleapis.com/v0/b/soccerya-31461.appspot.com/o/logo%2Fdefault%2FlogoImage.png?alt=media&token=b61b9de2-e9c0-41d0-9f65-f130bee72749',
            nickname : ''
        }
    }

    componentDidMount(){
        const uid = firebase.auth().currentUser.uid
        firebase.database().ref('users/'+ uid).once('value', snap => {
            this.setState({ nickname : snap.val().nickname})
        })
    }
    
   
    _onNameCheck = async (team_name) => {
        await this.setState({team_name : team_name})
        
        if( 1 < team_name.length && team_name.length < 9){
        firebase.database().ref('teams').orderByChild('team_name').equalTo(team_name).on('value', snap => {
            if(snap.val() != null)
                this.setState({check : false, color : '#c92a2a', error : '중복된 이름입니다.'})
            else
                this.setState({check : true, color : '#1971c2', error : ''})
        })
        }else{
            this.setState({error : '팀이름은 2~8 글자 사이로 입력해 주세요.', check: false})
        }
    }

    _onTeamCreate = async () => {
        const { team_name, team_area, team_info, team_member, nickname, path} = this.state
        const user = firebase.auth().currentUser
        const uid = user.uid
        const team_list = team_member.concat(uid) 
        const userName = user.displayName
        const date = moment.tz('Asia/Seoul').format('YYYY년 MM월 DD일')

        if(this.state.path != null)
        await firebase.storage().ref('logo/'+ this.state.team_name).child('/logo.jpg').putFile(path)
        .then((snap) => {
                this.setState({url : snap.downloadURL})
            }
            ).catch((error) => {
                console.log(error)
        })

        await firebase.database().ref('teams').push({
            team_name : team_name,
            team_captain : nickname,
            team_area : team_area,
            team_info : team_info,
            team_member : team_list,
            captain_uid : uid,
            date : date,
            url : this.state.url,
            recruit : false
        });

        const item = team_name
        
        await firebase.database().ref('users/'+ uid + '/teams').push().set({
            team_name : team_name,
            admin : true
        })

        this.props.navigation.navigate('Team_info',{name : item})
    }

    openPicker = async () =>{
        await ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping : true,
            includeBase64 : true
          }).then(image => {
             this.setState({path : image.path, data : image.data, mime : image.mime})
        })
      }

    render() {
        return (
            <View style={styles.createpage}>
                <View style={styles.container}>
                <ScrollView>
                <View style={{flex : 1}}>
                <View style={styles.avartar_container}>
                    <View>
                        {this.state.path ? 
                        <Avatar
                        rounded
                        size ='large'
                        onPress={this.openPicker}
                        source={{uri: `data:${this.state.mime};base64,${this.state.data}`}}
                        showEditButton
                    /> : 
                    <Avatar
                            size ='large'
                            onPress={this.openPicker}
                            rounded title="로고"
                            showEditButton
                        />}
                       
                    </View>
                    <View style={{marginTop : 20, justifyContent : 'flex-end'}}>
                        <Text>팀 로고</Text>
                    </View>
                </View>
                <View style= {styles.formcontainer}>
                <View style={styles.createform}>
                <Input
                    placeholder = '팀 이름'
                    value = {this.state.team_name}
                    leftIcon={{ type: 'font-awesome', name: 'vcard-o' }}
                    inputContainerStyle = {{ borderColor : '#fff'}}
                    leftIconContainerStyle = {{ width : 60}}
                    inputStyle = {{fontSize : 15}}
                    errorMessage = {this.state.error}
                    errorStyle={{color : 'red', paddingLeft : 30}}
                    onChangeText={(team_name) => this._onNameCheck(team_name)}
                />
                </View>

                <View style={styles.createform}>
                <Icon name ='flag-o' style={{width : 20, marginLeft : 40}} size={30} color='#000'/>
                <Picker
                            selectedValue={this.state.team_area}
                            style={{height : 20, width: 150,marginLeft : 20}}
                            itemStyle={{fontSize : 12}}
                            onValueChange ={(itemValue, itemIndex) => {
                                this.setState({ team_area : itemValue})
                            }}>
                            {
                            city_list.map((data,i) => {
                                return (
                                    <Picker.Item label={data} value={data} key={i}/>
                                )
                            })
                        } 
                        </Picker>
                </View>

                <View style={styles.createform}>
                <Input
                    placeholder = '팀 소개 ex) 연령대, 시간대'
                    value = {this.state.team_info}
                    inputContainerStyle = {{height : 200}}
                    leftIcon={{ type: 'font-awesome', name: 'futbol-o' }}
                    inputContainerStyle = {{ borderColor : '#fff'}}
                    leftIconContainerStyle = {{ width : 60}}
                    inputStyle = {{fontSize : 15}}
                    multiline
                    numberOfLines = {4}
                    onChangeText={(team_info) => this.setState({team_info : team_info})}
                />
                </View>

                </View>
                </View>
                </ScrollView>
                </View>
                
                <View style={styles.loginbutton}>
                <Button
                    title = "팀 만들기"
                    backgroundColor = {this.state.check ? '#a5d8ff' : '#228be6'}
                    onPress = {() => this._onTeamCreate()}
                    disabled = {!this.state.check || (this.state.team_area === '') || (this.state.team_info === '')}
                    buttonStyle = { {width : 220, height : 40}}
                />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    createpage : {
        flex : 1
    },
    container : {
        flex : 10,

    },
    avartar_container : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
        flexDirection : 'column',
        marginBottom : 20,
        padding : 18,
        borderBottomWidth : 0.7,
        borderColor : '#ced4da'
    },
    formcontainer : {
        flex : 2,
    },
    createform : {
        justifyContent : 'flex-start',
        flexDirection : 'row',
        margin : 20
    },
    loginbutton : {
        flex : 2,
        justifyContent : 'flex-end',
        flexDirection : 'column',
        alignItems : 'center',
        marginBottom : 20
    }
})

export default Create_Team;