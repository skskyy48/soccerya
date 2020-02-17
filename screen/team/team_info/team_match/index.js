import React, { Component } from 'react';
import { View, Text, StyleSheet,FlatList, TouchableOpacity, ScrollView,Dimensions} from 'react-native'
import firebase from 'react-native-firebase'
import CustomgoBackHeader from '../../../../common/CustomgoBackHeader'
import { Overlay } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

class Team_match extends Component {
    constructor(props){
        super(props)
        this.state = {
            match_list : [],
            visible : false,
            item : ''
        }
    }
    
    componentDidMount = () => {
        this.setState({match_list : []})
        firebase.database().ref('match_list').orderByChild('homeTeam').equalTo(this.props.navigation.getParam('name')).on('value',snap => {
            snap.forEach( child => {
                this.setState({match_list : this.state.match_list.concat(child.val())})
            })
        })
        firebase.database().ref('match_list').orderByChild('awayTeam').equalTo(this.props.navigation.getParam('name')).on('value',snap => {
            snap.forEach( child => {
                this.setState({match_list : this.state.match_list.concat(child.val())})
            })
        })
    }
    
    static navigationOptions = ({navigation}) => ({
        header : <CustomgoBackHeader title={'경기 일정'} navigation={()=> navigation.goBack()} />
    })

    render() {
        return (
            <View stlye={styles.container}>
                <ScrollView>
                <FlatList
                    data = {this.state.match_list}
                    keyExtractor = {item => item.info.match_date}
                    renderItem = {({ item }) => (
                        <View>
                        <TouchableOpacity
                        onPress = {() => this.setState({ visible : true, item : item})}>
                        <View style={{flexDirection : 'row', flex : 1,justifyContent : 'center', margin : 5}}>
                        <View style={{ margin : 10, borderRadius : 5, marginBottom : 3, padding :10, paddingRight : 15, paddingLeft : 15, backgroundColor : '#5c7cfa', alignItems : 'center'}}>
                        <Text style={{fontSize : 12, fontFamily : 'netmarbleL', marginBottom : 2, color : '#fff'}}>Home</Text>
                        <Text style={{fontSize : 15, fontFamily : 'netmarbleB', color : '#fff'}}>{item.homeTeam}</Text>
                        </View>
                        <View style={{justifyContent : 'center',margin : 10, marginBottom : 3}}>
                        <Text stlye={{fontSize : 12, fontFamily : 'metmarbleB'}}>VS</Text>
                        </View>
                        <View style={{margin : 10, borderRadius : 5, marginBottom : 3, padding : 10, paddingRight : 15, paddingLeft : 15, backgroundColor : '#5c7cfa', alignItems : 'center'}}>
                        <Text style={{fontSize : 12, fontFamily : 'netmarbleL', marginBottom : 2, color : '#fff'}}>Away</Text>
                        <Text style={{fontSize : 15, fontFamily : 'netmarbleB', color : '#fff'}}>{item.awayTeam}</Text>
                        </View>
                        </View>
                        <View style={{justifyContent : 'center',alignItems : 'center', marginBottom : 10}}>
                        <Text style={{fontSize : 12, fontFamily : 'netmarbleL'}}>{item.info.match_date}</Text>
                        </View>
                        </TouchableOpacity>
                        </View>
                    )}
                />
                </ScrollView>
                { this.state.item ? 
                <Overlay
                    isVisible={this.state.visible}
                    overlayStyle={{ padding : 0}}
                    onBackdropPress = {() => this.setState({visible : false})}
                    width={width - 50}
                    height= {height - 70}
                >
                    <View style={{flex : 1}}>
                        <View stlye={{flex : 1}}>
                        <View style={{flexDirection : 'row',justifyContent : 'flex-end', padding : 15, height : 50, backgroundColor : '#5858FA'}}>
                                <Icon name='close' size={20} color = '#fff' onPress={() => this.setState({visible : false})}/>
                        </View>
                        </View>
                        <ScrollView>
                        <View style={{margin : 20}}>
                            <View style={{flexDirection : 'row', flex : 1,justifyContent : 'center', margin : 5}}>
                            <View style={{ margin : 10, borderRadius : 5, marginBottom : 3, padding :10, paddingRight : 15, paddingLeft : 15, backgroundColor : '#3b5bdb', alignItems : 'center'}}>
                            <Text style={{fontSize : 12, fontFamily : 'netmarbleL', marginBottom : 2, color : '#fff'}}>Home</Text>
                            <Text style={{fontSize : 15, fontFamily : 'netmarbleB', color : '#fff'}}>{this.state.item.homeTeam}</Text>
                            </View>
                            <View style={{justifyContent : 'center',margin : 20, marginBottom : 3}}>
                            <Text stlye={{fontSize : 12, fontFamily : 'metmarbleB'}}>VS</Text>
                            </View>
                            <View style={{margin : 10, borderRadius : 5, marginBottom : 3, padding : 10, paddingRight : 15, paddingLeft : 15, backgroundColor : '#3b5bdb', alignItems : 'center'}}>
                            <Text style={{fontSize : 12, fontFamily : 'netmarbleL', marginBottom : 2, color : '#fff'}}>Away</Text>
                            <Text style={{fontSize : 15, fontFamily : 'netmarbleB', color : '#fff'}}>{this.state.item.awayTeam}</Text>
                            </View>
                            </View>
                        </View>
                        <View style = {{alignItems : 'flex-start', justifyContent : 'center', margin : 20,marginLeft : 30,paddingTop : 20}}>
                            
                            <Text style={{fontFamily : 'netmarbleM', fontSize : 15, padding : 5}}>내용 : {this.state.item.info.info}</Text>
                            <Text style={{fontFamily : 'netmarbleM', fontSize : 15, padding : 5}}>비용 : {this.state.item.info.cost}</Text>
                            <Text style={{fontFamily : 'netmarbleM', fontSize : 15, padding : 5}}>일시 : {this.state.item.info.match_date}</Text>
                            <Text style={{fontFamily : 'netmarbleM', fontSize : 15, padding : 5}}>종류 : {this.state.item.info.type}</Text>
                            <Text style={{fontFamily : 'netmarbleM', fontSize : 15, padding : 5}}>최소 인원 : {this.state.item.info.minNum}</Text>
                            <Text style={{fontFamily : 'netmarbleM', fontSize : 15, padding : 5}}>장소 : {this.state.item.info.address}</Text>

                            <View style={{marginLeft : 5,margin : 10}}>
                            <MapView
                                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                                style={{ width : 300, height : 150}}
                                region={this.state.item.info.region}
                                >
                                <Marker
                                    coordinate = {this.state.item.info.region}
                                    title = {this.state.item.info.address}
                                />
                            </MapView>
                            </View>
                            </View>
                        </ScrollView>
                    </View>
                </Overlay>
                : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1
    }
})

export default Team_match;