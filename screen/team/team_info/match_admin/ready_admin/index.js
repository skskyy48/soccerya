import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions,FlatList, Alert } from 'react-native'
import { ListItem, Button,Avatar } from 'react-native-elements'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import CustomgoBackHeader from '../../../../../common/CustomgoBackHeader'
import firebase from 'react-native-firebase';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

class Ready_admin extends Component {
    constructor(props){
        super(props)
        this.state = {
            ask_list : [],
            item : []
        }
    }
    static navigationOptions = ({navigation}) => ({
        header : <CustomgoBackHeader title={'매칭 정보'} navigation={()=> navigation.goBack()} />
    })



    matchDelete(key){
        firebase.database().ref('match/'+key ).remove()
    }

    componentDidMount = () => {
        this.setState({ item : this.props.navigation.getParam('item')})
        const item = this.props.navigation.getParam('item')
        firebase.database().ref('match/' + item.key+'/ask_list').on('value',snap => {
            snap.forEach(child => {
                this.setState({ ask_list : this.state.ask_list.concat(child.val())})
            })
        })
    }

    alertCreate = (item,teamname) => {
        Alert.alert(
            '매칭 수락',
            '수락하시겠습니까?',
            [
              {text: '확인', onPress: () => {firebase.database().ref('match_list').push({
                homeTeam : item.team_name,
                awayTeam : teamname,
                info : item
                })
                firebase.database().ref('match/'+item.key ).remove()
                this.props.navigation.goBack()
            }},
              {
                text: '취소',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
            ],
          );
    }

    matchCreate = (awayteam) => {
        const item = this.state.item
        
    }

    render() {
        const info = this.props.navigation.getParam('item')
        const admin = this.props.navigation.getParam('admin')
        return (
            <View style={{flex : 1}}>
                        <ScrollView>
                        <View style={{justifyContent : 'center' , alignItems : 'center', margin : 10, borderBottomWidth : 0.4, paddingBottom : 10}}>
                            <Avatar
                                size = 'large'
                                rounded
                                uri = {info.team_url}
                            />
                            <Text style={{fontFamily : 'netmarbleM', fontSize : 16, marginTop : 5}}>{info.team_name}</Text>
                        </View>
                        
                        <View style = {{alignItems : 'flex-start', justifyContent : 'center', margin : 20,marginLeft : 30}}>
                            
                            <Text style={{fontFamily : 'netmarbleM', fontSize : 15, padding : 5}}>내용 : {info.info}</Text>
                            <Text style={{fontFamily : 'netmarbleM', fontSize : 15, padding : 5}}>비용 : {info.cost}</Text>
                            <Text style={{fontFamily : 'netmarbleM', fontSize : 15, padding : 5}}>일시 : {info.match_date}</Text>
                            <Text style={{fontFamily : 'netmarbleM', fontSize : 15, padding : 5}}>종류 : {info.type}</Text>
                            <Text style={{fontFamily : 'netmarbleM', fontSize : 15, padding : 5}}>최소 인원 : {info.minNum}</Text>
                            <View style={{marginLeft : 5,margin : 10}}>
                            <MapView
                                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                                style={{ width : 300, height : 150}}
                                region={info.region}
                                >
                                <Marker
                                    coordinate = {info.region}
                                    title = {info.address}
                                />
                            </MapView>
                            
                        </View>
                        </View>
                        {admin ? 
                        <View>
                            <View style={{backgroundColor : '#FBFBEF'}}>
                                <Text style={{margin : 6, paddingLeft : 15, fontFamily : 'netmarbleM'}}>신청 목록</Text>
                            </View>
                            <FlatList
                                data={this.state.ask_list}
                                keyExtractor = {item=> item.ask_team_name}
                                renderItem={({item}) => (
                                    <ListItem
                                    style ={{ borderBottomWidth : 1, borderColor : '#CED0CE'}}
                                    containerStyle ={{padding : 3, marginLeft : 20}}
                                    title={item.ask_team_name}
                                    subtitle={item.ask_date}
                                    rightElement = {<View style={{flexDirection : 'row'}}>
                                        <Button
                                            title="수락"
                                            titleStyle = {{fontSize : 12}}
                                            buttonStyle = {{backgroundColor : '#3b5bdb',marginRight : 4}}
                                            onPress = {() => this.alertCreate(info,item.ask_team_name)}
                                        />
                                    </View>}
                                    />
                                )}
                            />
                        </View>
                         : null}
                        
                        </ScrollView>

                        {admin ? <View style={{flexDirection : 'row', alignItems : 'flex-end',justifyContent : 'center'}}>
                            <Button
                                buttonStyle={{width : width,borderRadius : 0, backgroundColor : '#e03131'}}
                                title="삭제"
                                onPress={() => this.matchDelete(info.key)}
                            />
                        </View>: 
                        null}
                        
                    </View>
        );
    }
}

export default Ready_admin;