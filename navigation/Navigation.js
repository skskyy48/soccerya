import { createMaterialTopTabNavigator, createSwitchNavigator, createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation'
import { createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import IconMa from 'react-native-vector-icons/MaterialCommunityIcons'
import CustomgoBackHeader from '../common/CustomgoBackHeader'
import CustomHeader from '../common/CustomHeader'


import HomeScreen from '../screen/home'
import LoginScreen from '../screen/user/auth/LoginScreen'
import Loading from '../screen/user/auth/AuthLoading'
import Notice from '../common/Notice'
import NoticeWrite from '../common/NoticeWrite'

import List_main from '../screen/team/list_main'
import Create_Team from '../screen/team/create_team'
import Team_join from '../screen/team/team_join'
import FirstUserModal from '../common/FirstUserModal'

import Team_info_main from '../screen/team/team_info_main'
import Team_search from '../screen/team/team_search'
import Member_admin from '../screen/team/team_info/team_admin/member_admin'
import Team_chat from '../screen/team/team_info/team_chat'

import Chat from '../screen/home/chat/Chat'
import chatList from '../screen/home/chat/chatList'
import Ready_admin from '../screen/team/team_info/match_admin/ready_admin'
import Match_admin from '../screen/team/team_info/match_admin'
import Team_match from '../screen/team/team_info/team_match/index'
import Team_info from '../screen/team/team_info'
import Ask_list from '../screen/team/team_info/team_admin/ask_list'
import User_info from '../screen/team/team_info/team_admin/ask_list/user_info'

import Match_main from '../screen/match/main'
import Create_match from '../screen/match/create_match'
import Match_info from '../screen/match/match_info'

import MyPage_main from '../screen/mypage/main'
import MyInfo from '../screen/mypage/myinfo'
import MyTeam from '../screen/mypage/myteam'
import Ask_team_list from '../screen/mypage/myteam/ask_team_list'
import MyTeam_list from '../screen/mypage/myteam/my_team_list'
import Inquire from '../screen/mypage/inquire'

import Privacy_policy from '../common/Privacy_policy'

const HomeStack = createStackNavigator({
    Home : { screen : HomeScreen},
    chatList : chatList,
    Chat : Chat,
    Notice : Notice,
    NoticeWrite : NoticeWrite,
})

const First = createStackNavigator({
    First : FirstUserModal,
    Privacy_policy : Privacy_policy
})
/*
const ChatStack = createStackNavigator({
    chatList : chatList,
    Chat : Chat,
},{initialRouteName : 'chatList'})
*/

const AuthStack = createStackNavigator({
    Login : LoginScreen,
},{headerMode : 'none'})


const Team = createMaterialTopTabNavigator({
    '팀 목록' : List_main,
    '내 팀' : Team_info_main,
},{tabBarOptions : {
    tabStyle : {
        height : 35,
        margin : 0,
        padding : 0
    },
    style : {
        backgroundColor : '#fff',
    },
    labelStyle : {
        color : '#000',
    },
    pressColor : '#e6e6ff',
    indicatorStyle : {
        backgroundColor : '#3333ff',
        height : 3,
    }
    
}})

const TeamStack = createStackNavigator({
    TeamStack : { screen : Team,
    navigationOptions : ({navigation}) => ({
        header : <CustomHeader title='팀' 
        leftHeader={<Icon name='plus-square' color='#fff' style={{ paddingRight : 5}} size={24} onPress={() => navigation.navigate('Create_Team')}/>} 
        rightHeader={<Icon name='search' color='#fff' style={{ paddingRight : 5}} size={24} onPress={() => navigation.navigate('Team_search')}></Icon>}/>
    })},
    TeamInfo_main : Team_info_main,
    Team_info : Team_info,
    Ask_list : Ask_list,
    User_info : User_info,
    Team_search : Team_search,
    List_main : {screen : List_main},
    Create_Team : Create_Team,
    Team_join : Team_join,
    Member_admin : Member_admin,
    Team_match : Team_match,
    Match_admin : Match_admin,
    Ready_admin : Ready_admin,
    Team_chat : Team_chat
})



const MatchStack = createStackNavigator({
    Match_main : { screen : Match_main},
    Create_match : Create_match,
    Match_info : Match_info
})

const MyPageStack = createStackNavigator({
    MyPage_main : { screen : MyPage_main,
        navigationOptions : {
            header : <CustomHeader title='내 정보' 
            leftHeader ={null}
            rightHeader={null}/>
        }},
    MyTeam : {screen : MyTeam,navigationOptions : ({navigation}) => ({
        header : <CustomgoBackHeader title="내 팀" navigation ={() => navigation.goBack()}/>
    })},
    MyInfo : MyInfo,
    Ask_team_list : { screen : Ask_team_list,navigationOptions : ({navigation}) => ({
        header : <CustomgoBackHeader title="신청 목록" navigation ={() => navigation.goBack()}/>
    })},
    MyTeam_list : {screen : MyTeam_list,navigationOptions : ({navigation}) => ({
        header : <CustomgoBackHeader title="팀 목록" navigation ={() => navigation.goBack()}/>
    })},
    Inquire : Inquire
})

const TapNavigator = createMaterialBottomTabNavigator(
    {
        '홈' : {screen : HomeStack,
        navigationOptions : {
            tabBarIcon : <Icon name='home' size={22}/>
        }
        },
        '팀' : { screen : TeamStack,
            navigationOptions : {
                tabBarIcon : <Icon name='soccer-ball-o' size={22}/>
            }},
        '매칭' : { screen : MatchStack,
            navigationOptions : {
                tabBarIcon : <IconMa name='soccer-field' size={22}/>
        }
        },
        '내 정보' : { screen : MyPageStack,
            navigationOptions : {
                tabBarIcon : <Icon name='user' size={22}/>
            }}
    },{
        initialRouteName : '홈',
        activeColor : '#000',
        barStyle : { backgroundColor : '#fff', borderTopWidth : 0.5},
    }
)


const Navigation = createAppContainer(createSwitchNavigator(
    {
        AuthLoading : Loading,
        Main : TapNavigator,
        Auth : AuthStack,
        First : First
    },
    {
        initialRouteName : 'AuthLoading'
    }
))

export default Navigation