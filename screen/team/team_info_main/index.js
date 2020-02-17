import React, { Component } from 'react';
import {View, StyleSheet,ScrollView, FlatList } from 'react-native'
import firebase from 'react-native-firebase'
import { withNavigation } from 'react-navigation'
import { ListItem } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'


class Team_info_main extends Component {

    constructor(props){
        super(props)
        this.state = {
            team_name : [],
            refreshing : false
        }
    }

    componentDidMount = async () => {
       
        await this.setState({ team_name : []})
        this.listRequest()
    }

    listRequest = async() => {
        const user = firebase.auth().currentUser
        const uid = user.uid
        await firebase.database().ref('users/'+ uid + '/teams').orderByChild('team_name').on('value',snap =>{
            this.setState({ team_name : []})
            snap.forEach(child => {
                this.setState({
                    team_name : this.state.team_name.concat(child.val().team_name)
                })
            })
            this.setState({refreshing : false})
        })
    }

    onRefreshinHandle = async ()=> {
        await this.setState({
            refreshing : true,
        })
        await this.listRequest()
    }

    render() {
        const { team_name } = this.state
        return (
            <View style={styles.container}>
                <View style={styles.team_list}>
                <ScrollView>
                <FlatList
                    data = {team_name}
                    showsVerticalScrollIndicator= {false}
                    keyExtractor = {item => item}
                    refreshing = {this.state.refreshing}
                    onRefresh = {() => this.onRefreshinHandle}
                    renderItem={({item}) =>
                    <ListItem
                    title={item}
                    onPress={() => this.props.navigation.navigate('Team_info',{ name : item})}
                    rightIcon = {<Icon name='chevron-right' size={20} color="#ced4da" />}
                    titleStyle = {{fontFamily : 'Handon', fontSize : 15}}
                />
                }
                />
                </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1
    },
    team_list : {
        flex : 2
    },
    
})

export default withNavigation(Team_info_main);