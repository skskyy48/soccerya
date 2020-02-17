import React, { Component } from 'react';
import { View, Text,StyleSheet, FlatList, ScrollView} from 'react-native'
import firebase from 'react-native-firebase'
import CustomgoBackHeader from '../../../../common/CustomgoBackHeader'
import {  ListItem } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import IconMa from 'react-native-vector-icons/MaterialCommunityIcons'
import IconMacons from 'react-native-vector-icons/MaterialIcons'
import { withNavigation } from 'react-navigation'

class Match_admin extends Component {
    constructor(props){
        super(props)
        this.state = {
            ask_list : [],
            ready_list : [],
            render_asklist : [],
        }
    }

    componentDidMount = async() => {

        firebase.database().ref('match').orderByChild('team_name').equalTo(this.props.navigation.getParam('name')).on('value',snap => {
            this.setState({ ready_list : []})
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
                    ask_list : child.val().ask_list
                }
                this.setState({ready_list : this.state.ready_list.concat(array)})
            })
        })
        
    }

    static navigationOptions = ({navigation}) => ({
        header : <CustomgoBackHeader title={'매칭 관리'} navigation={()=> navigation.goBack()} />
    })

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.ready_container}>
                <View style={{backgroundColor : '#FBFBEF'}}>
                    <Text style={{margin : 6, paddingLeft : 15, fontFamily : 'netmarbleM'}}>생성한 매칭</Text>
                </View>
                <ScrollView>
                    <FlatList
                        data={this.state.ready_list}
                        keyExtractor = {item => item.team_name}
                        renderItem={({item}) =>
                    <ListItem
                        containerStyle = {{ padding : 8, marginLeft : 15, marginRight : 15}}
                        style ={{ borderBottomWidth : 1, borderColor : '#CED0CE'}}
                        title = {item.team_name}
                        titleStyle = {{fontSize : 14, fontFamily : 'netmarbleM'}}
                        leftAvatar = {{uri : item.team_url, size : 50}}
                        rightIcon = {<Icon name='chevron-right' size={20} color="#ced4da" />}
                        subtitle = {<View>
                                <View style={{ flexDirection : 'row',alignItems : 'center'}}>
                                <IconMacons name='place' size={14} style={{marginRight : 3}}/>
                                <Text style={{fontSize : 12}}>{item.address}</Text>
                                </View>
                                <View style={{ flexDirection : 'row'}}> 
                                    <View style={{ flexDirection : 'row',alignItems : 'center'}}>
                                        <IconMa name = 'soccer-field' size={14} style={{marginRight : 3}}/>
                                        <Text style={{fontSize : 12, marginRight : 40}}>{item.type}</Text>
                                    </View>
                                    <View style={{ flexDirection : 'row',alignItems : 'center'}}>
                                        <IconMa name='calendar-heart' size={14} style={{marginRight : 3}}/>
                                        <Text style={{fontSize : 12}}>{item.match_date}</Text>
                                    </View>
                                </View>
                            </View>}
                        onPress ={() => this.props.navigation.navigate('Ready_admin',{ item : item, admin : this.props.navigation.getParam('admin')})}
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
    ask_container : {
        flex : 1
    },
    ready_container : {
        flex : 1
    }
})

export default withNavigation(Match_admin);