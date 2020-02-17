import React, { Component } from 'react';
import { View , Text ,ScrollView, TouchableOpacity,FlatList,Dimensions, Platform, Image} from 'react-native'
import firebase from 'react-native-firebase'
import {withNavigation } from 'react-navigation'
import { Avatar, Header} from 'react-native-elements'
import SplashScreen from 'react-native-splash-screen'
import IconMa from 'react-native-vector-icons/MaterialCommunityIcons'

const width = Dimensions.get('window').width

class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            user : '',
            uid : '',
            check : '',
            loading : true,
            first : true,
            new_team : [],
            new_match : [],
            notice : [],
            test : ''
        }
    }

    componentDidMount = () => {
        const user = firebase.auth().currentUser
        const uid = user.uid
        setTimeout(() => {
            SplashScreen.hide()
        },1000)

        firebase.database().ref('users/'+ uid).once("value",snap => {
            if(snap.exists()){
                return null
            }else{
                this.props.navigation.navigate('First')   
            }
        })

        firebase.database().ref('teams').orderByChild('recruit').equalTo(true).limitToLast(7).on('value', snap => {
            snap.forEach(child => {
                this.setState({new_team : this.state.new_team.concat(child.val())})
            })
        })

        firebase.database().ref('match').orderByKey().limitToLast(7).on('value', snap => {
            snap.forEach(child => {
                this.setState({new_match : this.state.new_match.concat(child.val())})
            })
        })

        firebase.database().ref('notice').orderByKey().limitToLast(5).once('value',snap => {
            snap.forEach(child => {
                this.setState({notice : this.state.notice.concat(child.val())})
            })
        })

        this.setState({
            uid : uid,
            user : user,
        })
    }

    static navigationOptions = ({
        header : null
    })



    render() {

        return (
            <View style={{backgroundColor : '#E6E6E6'}}>         
                <Header
                    leftComponent ={<Image source={require('../../android/app/src/main/assets/image/logo.png')} style={{ width : 75, height : 50, marginLeft : 10}}/>}
                    rightComponent ={<IconMa name='facebook-messenger' color='#fff' style={{ paddingLeft : 5}} size={26} onPress={()=>this.props.navigation.navigate('chatList')}/>}
                    backgroundColor = "#1c7ed6"
                    outerContainerStyles={{
                        justifyContent : 'center',
                    }}
                    innerContainerStyles={{
                        alignItems : 'center',
                        justifyContent : 'center'
                    }}
                    containerStyle ={{
                        marginTop : Platform.OS ==='ios' ? 0 : -30,
                        justifyContent : 'center',
                        alignItems : 'center',
                        paddingTop : 30,
                        height : 75
                    }}
                />

                <ScrollView>
                <View style={{paddingLeft : 5, paddingRight : 10}}>
                <View style={{marginTop : 10,height : 170, backgroundColor : '#fff'}}>  
                <View style={{backgroundColor : '#d0ebff'}}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Notice')}
                    >
                        <Text style={{margin : 6, paddingLeft : 5, fontFamily : 'netmarbleM'}}>공지사항</Text>
                    </TouchableOpacity>
                </View>
                
                <View>
                {
                            this.state.notice.map((data,i) => {
                                return(
                                    <Text key={i} style={{ paddingLeft : 5,padding : 5, fontFamily : 'netmarbleM',borderColor : '#E6E6E6', borderBottomWidth : 1}}>{data.title}</Text>
                                )
                            })
                }
                </View>
                </View>  

                <View style = {{marginTop : 10,height : 140}}>  
                <View>
                    <Text style={{ marginBottom : 0,paddingLeft : 5, fontFamily : 'netmarbleM'}}>모집중인 팀</Text>
                </View>
                <ScrollView horizontal>
                <View style={{flexDirection : 'row',alignItems : 'center',justifyContent : 'center'}}>
                    <FlatList
                        data={this.state.new_team}
                        renderItem = {({item}) =>
                        (
                            <View style={{width : 100, height : 100,backgroundColor : '#fff',flexDirection : 'column',margin : 3,borderRadius : 4, alignItems : 'center',justifyContent : 'center'}}>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Team_join',{name : item.team_name, item : item
                                    })}
                                    style={{justifyContent : 'center', alignItems:'center'}}
                                    >
                                <Avatar
                                    rounded
                                    source={{ uri : item.url}}
                                    size='medium'
                                />
                                <Text style={{fontFamily : 'netmarbleM'}}>{item.team_name}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                    numColumns={7}
                    keyExtractor={(item,index) => item}
                />
                </View>
                </ScrollView>
                </View>  

                <View style = {{marginTop : 10,marginBottom : 100, height : 170, backgroundColor : '#fff'}}>  
                <View style={{backgroundColor : '#d0ebff', }}>
                    <Text style={{margin : 6, paddingLeft : 5, fontFamily : 'netmarbleM'}}>최근 생성 매치</Text>
                </View>
                <ScrollView horizontal>
                <View style={{flexDirection : 'row', alignItems : 'center'}}>
                    {this.state.new_match.map((data,i) => {
                        return (
                            <View key={i} style={{margin : 10, paddingLeft : 10, paddingRight : 10,justifyContent : 'center', alignItems:'center'}}>
                                    <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Match_info',{item : data})}
                                    style={{justifyContent : 'center', alignItems:'center'}}
                                    >
                                    <Avatar
                                        rounded
                                        source={{uri : data.team_url}}
                                        size='medium'
                                    />
                                <Text style={{fontSize : 12, fontFamily : 'netmarbleM'}}>{data.team_name}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    })}
                </View>
                </ScrollView>
                </View>
                
                
                </View>
                </ScrollView>
                
            </View>
        );
    }
}

export default withNavigation(Home);