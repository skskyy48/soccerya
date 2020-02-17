import React, { Component } from 'react';
import { View , Text, Platform, TouchableOpacity,FlatList, ActivityIndicator} from 'react-native'
import firebase from 'react-native-firebase'
import { Overlay, Header, ListItem, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import IconMa from 'react-native-vector-icons/MaterialCommunityIcons'
import IconMacons from 'react-native-vector-icons/MaterialIcons'
import { withNavigation } from 'react-navigation'

const city_list = ['서울특별시','경기도','인천광역시','강원도','충청남도','대전광역시','충청북도','부산광역시', '울산광역시','대구광역시','전라남도','전라북도','광주광역시','제주도','전체']

class Main extends Component {
    constructor(props){
        super(props)
            this.state = {
                match_list : [],
                searchVisible : false,
                juso_list : city_list,
                city : '',
                district : [],
                check : false,
                city_array : [],
                backgroundColor : '#1864ab',
                matchVisible : false,
                item : null,
                myteam : ['선택'],
                team_name : '선택',
                refreshing : false,
                loading : false,
                render_loading : true
            }
    }

    static navigationOptions = ({
        header : null
    })
    

    componentDidMount = () => {
        this.listRequest()
        
        const user_uid = firebase.auth().currentUser
        const uid = user_uid.uid
        firebase.database().ref('users/'+ uid + '/teams').orderByChild('team_name').on('value',snap =>{
            snap.forEach(child => {
                this.setState({
                    myteam : this.state.myteam.concat(child.val().team_name)
                })
            })
        })
        this.setState({render_loading : false})
    }

    searchCity = (city) => {
        this.setState({ searchVisible : false, match_list : []})
        if(city === '전체'){
            firebase.database().ref('match').on('value',snap => {
                this.setState({match_list : []})
                snap.forEach( child => {
                    const array = {
                        address : child.val().address,
                        cost : child.val().cost,
                        create_date : child.val().create_date,
                        info : child.val().info,
                        match_date : child.val().match_date,
                        minNum : child.val().minNum,
                        region : child.val().region,
                        team_name : child.val().team_name,
                        type : child.val().type,
                        key : child.key,
                        team_captain : child.val().team_captain,
                        place_name : child.val().place_name,
                        team_url : child.val().team_url
                    }
                    this.setState({ match_list : this.state.match_list.concat(array)})                })
            })
        }else{
        firebase.database().ref('match').orderByChild('city').equalTo(city).on('value',snap => {
            snap.forEach(child => {
                const array = {
                    address : child.val().address,
                    cost : child.val().cost,
                    create_date : child.val().create_date,
                    info : child.val().info,
                    match_date : child.val().match_date,
                    minNum : child.val().minNum,
                    region : child.val().region,
                    team_name : child.val().team_name,
                    type : child.val().type,
                    key : child.key,
                    team_captain : child.val().team_captain,
                    place_name : child.val().place_name,
                    team_url : child.val().team_url
                }
                this.setState({ match_list : this.state.match_list.concat(array)})            });
        })
        }
    }

    listRequest = async() => {
        await firebase.database().ref('match').on('value',snap => {
            this.setState({match_list : []})
            snap.forEach( child => {
                const array = {
                    address : child.val().address,
                    cost : child.val().cost,
                    create_date : child.val().create_date,
                    info : child.val().info,
                    match_date : child.val().match_date,
                    minNum : child.val().minNum,
                    region : child.val().region,
                    team_name : child.val().team_name,
                    type : child.val().type,
                    key : child.key,
                    team_captain : child.val().team_captain,
                    place_name : child.val().place_name,
                    team_url : child.val().team_url
                }
                this.setState({ match_list : this.state.match_list.concat(array)})
            })
        })
        this.setState({ loading : false,refreshing : false})
    }

    onRefreshinHandle = ()=> {
        this.setState({
            refreshing : true,
            loading : true
        })
        .then(        this.listRequest()        )
    }

    

    render() {
        const Banner = firebase.admob.Banner;
        const AdRequest = firebase.admob.AdRequest;
        const request = new AdRequest();
        return (
            
            <View style={{flex : 1, backgroundColor : '#E6E6E6'}}>
                <Header
                    leftComponent ={<IconMa name='calendar-plus' color='#fff' style={{ paddingRight : 5}} size={24} onPress={() => this.props.navigation.navigate('Create_match')}/>}
                    rightComponent ={<Icon name='search' color='#fff' style={{ paddingRight : 5}} size={24} onPress={() =>this.setState({searchVisible : true})}></Icon>}
                    backgroundColor = "#1c7ed6"
                    outerContainerStyles={{
                        justifyContent : 'center',
                    }}
                    innerContainerStyles={{
                        alignItems : 'center'
                    }}
                    containerStyle ={{
                        marginTop : Platform.OS ==='ios' ? 0 : -30,
                        justifyContent : 'center',
                        alignItems : 'center',
                        paddingTop : 30,
                        height : 75
                    }}
                />
                <Banner
                    unitId='ca-app-pub-3940256099942544/6300978111'
                    size={'SMART_BANNER'}
                    request={request.build()}
                    onAdLoaded={() => {
                    console.log('Advert loaded');
                    }}
                />
                <View style={{backgroundColor : '#fff'}}>
                    <Text style={{margin : 6, paddingLeft : 5, fontFamily : 'netmarbleM'}}>경기 목록</Text>
                </View>
                <View style={{marginLeft : 2,marginRight : 2, backgroundColor : '#E6E6E6'}}>
                <FlatList
                    data = {this.state.match_list}
                    showsVerticalScrollIndicator= {false}
                    refreshing = {this.state.refreshing}
                    onRefresh = {() => this.onRefreshinHandle}
                    keyExtractor = {item => item.key}
                    renderItem={({item}) =>
                    <ListItem
                        containerStyle = {{ padding : 8, marginLeft : 6, marginRight : 6, marginTop : 5,borderRadius : 4}}
                        title = {item.team_name}
                        titleStyle = {{fontSize : 14, fontFamily : 'netmarbleM'}}
                        rightIcon = {<Icon name='chevron-right' size={20} color="#1c7ed6" />}
                        subtitle = {<View>
                                <View style={{ flexDirection : 'row',alignItems : 'center', marginTop : 5}}>
                                <IconMacons name='place' size={14} style={{marginRight : 3}}  color ='#f03e3e'/>
                                <Text style={{fontSize : 12,color : '#A4A4A4'}}>{item.place_name}</Text>
                                </View>
                                <View style={{ flexDirection : 'row'}}> 
                                    <View style={{ flexDirection : 'row',alignItems : 'center'}}>
                                        <IconMa name = 'soccer-field' size={14} style={{marginRight : 3}} color ='#82c91e'/>
                                        <Text style={{fontSize : 12, marginRight : 40, color : '#A4A4A4'}}>{item.type}</Text>
                                    </View>
                                    <View style={{ flexDirection : 'row',alignItems : 'center'}}>
                                        <IconMa name='calendar-heart' size={14} style={{marginRight : 3}} color='#fcc419'/>
                                        <Text style={{fontSize : 12,color : '#A4A4A4'}}>{item.match_date}</Text>
                                    </View>
                                </View>
                            </View>}
                        onPress ={() => this.props.navigation.navigate('Match_info',{item : item})}
                    />
                }
                />
                </View>
                    <Overlay
                        isVisible={this.state.searchVisible}
                        overlayStyle={{ padding : 0}}
                        onBackdropPress = {() => this.setState({ searchVisible : false, city : '',check : false})}
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

export default withNavigation(Main);