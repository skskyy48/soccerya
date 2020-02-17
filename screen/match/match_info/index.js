import React, { Component } from 'react';
import {Alert,Picker, View , Text,ScrollView, Dimensions} from 'react-native'
import firebase from 'react-native-firebase'
import { Button,Avatar } from 'react-native-elements'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import moment from 'moment-timezone'
import { withNavigation } from 'react-navigation'
import CustomgoBackHeader from '../../../common/CustomgoBackHeader'

const width = Dimensions.get('window').width

class Match_info extends Component {
    constructor(props){
        super(props)
            this.state = {
                backgroundColor : '#1864ab',
                myteam : ['선택'],
                team_name : '선택',
                item : null,
                cancle : false,
                cancleTeam : '',
                key : '',
                picker : false
            }
    }

    componentDidMount = () => {
        
        const user_uid = firebase.auth().currentUser
        const uid = user_uid.uid
        firebase.database().ref('users/'+ uid + '/teams').orderByChild('team_name').on('value',snap =>{
            snap.forEach(child => {
                this.setState({
                    myteam : this.state.myteam.concat(child.val().team_name)
                })
            })
        })


        this.setState({picker : this.props.navigation.getParam('picker'),item : this.props.navigation.getParam('item'), cancle : this.props.navigation.getParam('cancle'), cancleTeam : this.props.navigation.getParam('cancleTeam')})
    }


    static navigationOptions = ({navigation}) => ({
        header : <CustomgoBackHeader title='' navigation={()=> navigation.goBack()} />
    })

    matchSubmit = async () => {
        const date = moment.tz('Asia/Seoul').format('MM월 DD일 HH:mm')
        if(this.state.team_name === '선택'){
            Alert.alert(
                '신청',
                '신청할 팀을 선택해 주세요',
                [
                    {text : '확인'}
                ]
            )
        }else{
            firebase.database().ref('match/'+ this.state.item.key + '/ask_list').push({
                ask_team_name : this.state.team_name,
                ask_date : date
            })
            this.setState({cancle : true})
        }
    }

    teamSelect = (team_name) => {
        this.setState({team_name : team_name})
        firebase.database().ref('match/' + this.state.item.key + '/ask_list').orderByChild('ask_team_name').equalTo(team_name).once('value',snap => {
            if(snap.exists()){
                this.setState({cancle : true})
            }else{
                this.setState({cancle : false})
            }
        })
    }

    matchCancle = () => {
        var key = ''
        firebase.database().ref('match/'+ this.state.item.key + '/ask_list').orderByChild('ask_team_name').equalTo(this.state.team_name).once('value', snap => {
            snap.forEach(child => {
                firebase.database().ref('match/' + this.state.item.key + '/ask_list/' + child.key).remove()
            })
        })

        this.props.navigation.goBack()
    }



    render() {
        const item = this.props.navigation.getParam('item')
        return (
                    <View style={{flex : 1}}>
                        <ScrollView>
                        <View style={{justifyContent : 'center' , alignItems : 'center', margin : 10, borderBottomWidth : 0.4, paddingBottom : 10}}>
                            <Avatar
                                size = 'large'
                                rounded
                                source={{uri: item.team_url}}
                                />
                            <Text style={{fontFamily : 'netmarbleM', fontSize : 16, marginTop : 5}}>{item.team_name}</Text>
                        </View>
                        
                        <View style = {{alignItems : 'flex-start', justifyContent : 'center', margin : 20,marginLeft : 30}}>
                            
                            <Text style={{fontFamily : 'netmarbleM', fontSize : 15, padding : 5}}>내용 : {item.info}</Text>
                            <Text style={{fontFamily : 'netmarbleM', fontSize : 15, padding : 5}}>비용 : {item.cost}</Text>
                            <Text style={{fontFamily : 'netmarbleM', fontSize : 15, padding : 5}}>일시 : {item.match_date}</Text>
                            <Text style={{fontFamily : 'netmarbleM', fontSize : 15, padding : 5}}>종류 : {item.type}</Text>
                            <Text style={{fontFamily : 'netmarbleM', fontSize : 15, padding : 5}}>최소 인원 : {item.minNum}</Text>
                            <Text style={{fontFamily : 'netmarbleM', fontSize : 15, padding : 5}}>장소 : {item.place_name}</Text>
                            {this.state.picker ? null : 
                            <View style = {{flexDirection : 'row'}}>
                            <Text style={{fontFamily : 'netmarbleM', fontSize : 15, padding : 5}}>신청할 팀 선택 </Text>
                                <Picker
                                    selectedValue={this.state.team_name}
                                    itemStyle={{fontSize : 12}}
                                    style = {{height : 30, width : 180}}
                                    onValueChange = {(itemValue, itemIndex) => {
                                        this.teamSelect(itemValue)
                                    }}
                                >
                                    {
                                    this.state.myteam.map((data,i) => {
                                        return (
                                            <Picker.Item label={data} value={data} key={i}/>
                                        )                                        })
                                    }
                                </Picker>
                            </View>}
                            
                            <View style={{marginLeft : 5,margin : 10}}>
                            <MapView
                                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                                style={{ width : 300, height : 150}}
                                region={item.region}
                                >
                                <Marker
                                    coordinate = {item.region}
                                    title = {item.address}
                                />
                            </MapView>
                            
                        </View>
                        </View>
                        </ScrollView>
                        <View style={{flexDirection : 'row', alignItems : 'flex-end',justifyContent : 'center'}}>
                            <Button
                                title="메세지"
                                buttonStyle={{width : (width)/2, borderRadius : 0, backgroundColor : '#ffc078'}}
                                onPress={() => {this.props.navigation.navigate('Chat', { receiver : item.team_captain})
                                                }}
                            />
                            {this.state.cancle ?
                            <Button
                                buttonStyle={{width : (width)/2,borderRadius : 0, backgroundColor : '#f03e3e'}}
                                title="취소"

                                onPress={() => this.matchCancle()}
                            />
                                 :
                            <Button
                                buttonStyle={{width : (width)/2,borderRadius : 0, backgroundColor : '#1c7ed6'}}
                                title="신청"

                                onPress={() => this.matchSubmit()}
                            />
                                 
                                 }
                            
                        </View>
                    </View>
        );
    }
}


export default withNavigation(Match_info);