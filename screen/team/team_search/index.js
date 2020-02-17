import React, { Component } from 'react';
import { View, Text,FlatList, Dimensions, TouchableOpacity } from 'react-native'
import firebase from 'react-native-firebase'
import { SearchBar, ListItem, Overlay, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import LottieView from 'lottie-react-native'

const width = Dimensions.get('window').width
const city_list = ['서울특별시','경기도','인천광역시','강원도','충청남도','대전광역시','충청북도','부산광역시', '울산광역시','대구광역시','전라남도','전라북도','광주광역시','제주도','전체']

class Team_search extends Component {
    static navigationOptions = {
        header : null
    }

    constructor(props){
        super(props)
        this.state = {
            team_name : '',
            team_list : [],
            juso_list : city_list,
            city : '',
            areaSearch : false,
            recruit : '#fff',
            citycolor : '#fff'

        }
    }
    

    teamNameSearch = search => {
        this.setState({ team_name : search, team_list : []})
        if(search != ''){
        firebase.database().ref('teams').orderByChild('team_name').equalTo(search).once('value', snap => {
            snap.forEach((child) => {
                this.setState({team_list : this.state.team_list.concat(child.val())})
            })
        })
    }
    }

    recruitTeam(){
        this.setState({ team_list : [],citycolor : '#fff', recruit : '#d0ebff'})

        firebase.database().ref('teams').orderByChild('recruit').equalTo(true).once('value',snap => {
            snap.forEach((child) => {
                this.setState({team_list : this.state.team_list.concat(child.val())})
            })
        })
    }

    searchCity(city){
        this.setState({ team_list : [],citycolor : '#d0ebff', recruit : '#fff'})
        
        firebase.database().ref('teams').orderByChild('team_area').equalTo(city).once('value',snap => {
            snap.forEach((child) => {
                this.setState({team_list : this.state.team_list.concat(child.val())})
            })
        })
        if(city === '전체'){
            firebase.database().ref('teams').once('value', snap => {
                snap.forEach((child) => {
                    this.setState({team_list : this.state.team_list.concat(child.val())})
                })
            })
        }
        this.setState({areaSearch : false})
    }

    render() {
        return (
            <View>
                <View>
            <SearchBar
                platform = 'android'
                placeholder="팀 이름을 입력 해 주세요"
                onChangeText={this.teamNameSearch}
                value={this.state.team_name}
                containerStyle ={{height : 60, width : width, backgroundColor : '#1c7ed6',paddingLeft : 5, paddingRight : 5}}
                inputContainerStyle = {{backgroundColor : '#fff'}}
                inputStyle = {{fontFamily : 'netmarbleL', fontSize : 15}}
                cancelIcon = {<Icon name="arrow-left" onPress={() => this.props.navigation.goBack()} size={24}/>}
            />
            </View>
            <View style={{flexDirection : 'row', borderBottomWidth : 0.3, borderColor : '#1c7ed6'}}>
                <TouchableOpacity
                    onPress={() => this.recruitTeam()}
                    style={{width : width/2,height : 30, alignItems : 'center',justifyContent:'center',backgroundColor : this.state.recruit}}
                >
                    <Text style={{fontSize : 15, fontFamily : 'netmarbleM', paddingLeft : 10}}>모집 중</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{width : width/2,height : 30, alignItems : 'center',justifyContent:'center',backgroundColor : this.state.citycolor}}
                    onPress={() => this.setState({ areaSearch : true})}
                >
                    <Text style={{fontSize : 15, fontFamily : 'netmarbleM', paddingLeft : 10}}>지역 별</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                    data = {this.state.team_list}
                    showsVerticalScrollIndicator= {false}
                    keyExtractor = {item => item.team_name}
                    renderItem={({item}) =>
                    <ListItem
                    containerStyle = {{ padding : 8, marginLeft : 10, marginRight : 10, marginTop : 5,borderBottomWidth : 0.3, paddingRight : 30}}
                    rightAvatar = {{ source  : {uri : item.url}, rounded : true, size : 50}}
                    title = {item.team_name}
                    titleStyle = {{fontSize : 15, fontFamily : 'netmarbleM', paddingLeft : 10}}
                    subtitle = {<View style={{paddingLeft : 5,paddingTop : 5}}>
                    <View style={{marginLeft : 5}}>
                        <View style={{ flexDirection : 'row',alignItems : 'center',width : 120}}>
                            <Icon name='globe' size={14} style={{marginRight : 3}} color='#37b24d'/>
                            <Text style={{fontSize : 12,color : '#A4A4A4'}}>{item.team_area}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection : 'row',marginLeft : 5}}>
                    <View style={{ flexDirection : 'row',alignItems : 'center', marginRight : 30}}>
                            <Icon name = 'group' size={12} style={{marginRight : 3}} color='#212529'/>
                            <Text style={{fontSize : 12, marginRight : 40,color : '#A4A4A4'}}>{item.team_member.length}</Text>
                        </View>
                        <View style={{ flexDirection : 'row',alignItems : 'center'}}>
                            <Icon name = 'calendar' size={14} style={{marginRight : 3}} color="#fcc419"/>
                            <Text style={{fontSize : 12, marginRight : 40,color : '#A4A4A4'}}>{item.date}</Text>
                        </View>
                        
                        </View>
                        <View style={{ flexDirection : 'row',alignItems : 'center'}}>
                        {
                            item.recruit ?
                            <View style={{ flexDirection : 'row',alignItems : 'center',justifyContent : 'center'}}>
                            <LottieView
                                source='recruit.json'
                                style={{width : 25, height : 25,padding : 0,margin : 0}}
                                autoPlay
                                loop/>
                                <Text style={{fontSize : 12,color : '#A4A4A4'}}>모집 중</Text>
                                </View>: null
                        }
                        </View>
                    </View>}
                        onPress = {() => this.props.navigation.navigate('Team_join',{
                            item : item
                        })}
                    />
                }
                />
                <Overlay
                        isVisible={this.state.areaSearch}
                        overlayStyle={{ padding : 0}}
                        onBackdropPress = {() => this.setState({ areaSearch : false, city : '',check : false})}
                        width="auto"
                        height={300}
                    >
                    <View style={{flex:1}}>
                            <View style = {{alignItems : 'center',width : 300, height : 50, justifyContent : 'center',borderBottomWidth : 1, borderColor : '#1971c2'}}>
                                <Text style={{fontFamily : 'netmarbleM'}}>{this.state.city}</Text>
                            </View>
                        <FlatList
                        data={this.state.juso_list}
                        renderItem = {({item}) =>
                            (
                                <View style={{flexDirection : 'column'}}>
                                <TouchableOpacity
                                    style={{width : 100,height : 50, alignItems : 'center',justifyContent : 'center'}}
                                    onPress ={() => this.setState({ city : item,check : true})}
                                >
                                    <Text style={{fontFamily : 'netmarbleM'}}>{item}</Text>
                                </TouchableOpacity>
                                </View>
                            )
                        }
                        numColumns={3}
                        keyExtractor={(item,index) => item}
                        />
                        <View style={{justifyContent : 'flex-end'}}>
                            <Button
                                icon={
                                    <Icon
                                        name = 'search'
                                        size={15}
                                        color = '#fff'
                                        style={{marginRight : 5}}
                                    />
                                }
                                title='검색'
                                style={{width : 300, height : 50, marginTop : 20 ,justifyContent : 'flex-end'}}
                                onPress = {() => this.searchCity(this.state.city)}
                            />
                        </View>
                    </View>
                    </Overlay>
            </View>

        );
    }
}

export default Team_search;