import React, { Component } from 'react';
import { View , StyleSheet} from 'react-native'
import { withNavigation } from 'react-navigation'
import firebase from 'react-native-firebase'
import { ListItem } from 'react-native-elements'

class MyTeam_list extends Component {
    constructor(props){
        super(props)
        this.state = {
            team_name : []
        }
    }

    componentDidMount = () => {
        const user = firebase.auth().currentUser
        const uid = user.uid

        firebase.database().ref('users/'+ uid + '/teams').orderByChild('team_name').on('value',snap =>{
            snap.forEach(child => {
                this.setState({
                    team_name : this.state.team_name.concat(child.val().team_name)
                })
            })
        })
    }

    render() {
        const { team_name } = this.state
        return (
            <View style={styles.container}>
            
                <View style={styles.team_list}>
                {
                    team_name.map((list,i) => (
                        <ListItem
                            key = {i}
                            title={list}
                            onPress = {() => {this.props.navigation.navigate('Team_info',{
                                name : list
                                })
                            }}
                        />
                    ))
                }
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
    }
})

export default withNavigation(MyTeam_list);