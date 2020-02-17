import React, { Component } from 'react';
import { View , Text , StyleSheet, FlatList,ActivityIndicator} from 'react-native'
import firebase from 'react-native-firebase'
import LoadingIndicator from '../../../common/LoadingIndicator'
import { withNavigation} from 'react-navigation'
import {ListItem } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import LottieView from 'lottie-react-native'

class List_main extends Component {
    constructor(props){
        super(props)
        this.state = {
            team_list : [],
            loading : true,
            refreshing : false,
            key : '',
            test_list : null,
            test_key : '',
            footer : false
        }
    }

    componentDidMount = () => {
        this.setState({ loading : true})
        if(this.state.test_list == null){
        this.listRequest()
        }
    }
    

    listRequest = async () => {
        let arrayOfKeys = []
        let array = []

        await firebase.database().ref('teams')
                    .orderByKey()
                    .limitToLast(7)
                    .once('value', snap =>{
            this.setState({ team_list : []})
            snap.forEach((child) => {
                array = array.concat(child.val())
                arrayOfKeys = arrayOfKeys.concat(child.key)
            })
            arrayOfKeys = arrayOfKeys.reverse()
            this.setState({team_list : array.reverse() ,loading : false,refreshing : false,test_list : arrayOfKeys[arrayOfKeys.length-1]})
        })
        
    }

    loadMore = () => {
        this.setState({footer : true})
        let arrayOfKeys = []
        let array = this.state.team_list
        firebase.database().ref('teams')
                    .orderByKey()
                    .limitToLast(6)
                    .endAt(this.state.test_list)
                    .once('value', snap =>{
            snap.forEach((child) => {
                array = array.concat(child.val())
                arrayOfKeys = arrayOfKeys.concat(child.key)
            })
            array = array.reverse().slice(1)
            arrayOfKeys = arrayOfKeys.reverse()
            this.setState({team_list : array.reverse(),footer : false, test_list : arrayOfKeys[arrayOfKeys.length-1]})
        })
    }
    

    onRefreshinHandle = async ()=> {
        await this.setState({
            refreshing : true,
            loading : true
        })
        await this.listRequest()
    }

    renderFooter = () => {
        if(!this.state.footer) return null
        return(
            <View style = {{padding : 10}}>
                <ActivityIndicator size="large"/>
                </View>
        )
    }



    render() {
        const { team_list , loading } = this.state
        return (
            <View style={styles.container}>
                { loading ? <LoadingIndicator/> : 
            <View style={styles.list_container}>
                <View style={styles.list}>
                <FlatList
                    data = {team_list}
                    showsVerticalScrollIndicator= {false}
                    keyExtractor = {item => item.team_name}
                    refreshing = {this.state.refreshing}
                    onRefresh = {this.onRefreshinHandle}
                    ListFooterComponent = {this.renderFooter}
                    onEndReached = {this.loadMore}
                    renderItem={({item}) =>
                    <ListItem
                    containerStyle = {{ padding : 8, marginLeft : 6, marginRight : 6, marginTop : 5,borderBottomWidth : 0.3, paddingRight : 30}}
                    rightAvatar = {{ source  : {uri : item.url}, size : 50}}
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
                            name : item.team_name, item : item
                        })}
                    />
                }
                />
                </View>
            </View>
            }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1
    },
    list_container : {
        flex : 1,
    },
    list : {
        flex : 8,
        marginLeft : 2,
        marginRight : 2, 
    },
    create_button : {
        flex : 1,
        justifyContent : 'flex-end'
    }, 
    actionButtonIcon: {
        fontSize: 20,
        height: 10,
        color: 'white',
    },
})

export default withNavigation(List_main);