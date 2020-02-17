import React, { Component } from 'react';
import { View, Text, Picker , StyleSheet,ScrollView,TouchableOpacity, TextInput, Dimensions} from 'react-native'
import CustomgoBackHeader from '../../../common/CustomgoBackHeader'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/FontAwesome'
import { Overlay , Avatar, CheckBox, Button} from 'react-native-elements'
import firebase from 'react-native-firebase'
import moment from 'moment-timezone'
import DatePicker from 'react-native-datepicker'
import RNGooglePlaces from 'react-native-google-places'

const width = Dimensions.get('window').width

class Create_match extends Component {
    constructor(props){
        super(props)
        this.state = {
            address : '',
            region : {
                latitude : 37.78825,
                longitude : -122.4324,
                latitudeDelta: 0.004757,
                longitudeDelta: 0.006866
            },
            markers : {
                latlng : {
                    latitude : 37.78825,
                    longitude : -122.4324,
                },
                title : 'title',
            },
            visible : false,
            teams : ['선택'],
            team_name : '선택',
            team : null,
            checkedSoccer : false,
            checkedFutsal : false,
            minNum : '',
            info : '',
            cost : '',
            loading : false,
            match_date : '',
            city : '',
            address_array : [],
            place_name : '클릭하여 검색'
        }
    }

    static navigationOptions = ({navigation}) => ({
        header : <CustomgoBackHeader title='매칭 생성' navigation={()=> navigation.goBack()} />
    })

    componentDidMount = async () => {
        const user_uid = firebase.auth().currentUser
        const uid = user_uid.uid
        await firebase.database().ref('users/'+ uid + '/teams').orderByChild('team_name').on('value',snap =>{
            snap.forEach(child => {
                this.setState({
                    teams : this.state.teams.concat(child.val().team_name)
                })
            })
        })
        this.getCurrentPosition()
    }

    openSearchModal() {
    RNGooglePlaces.openAutocompleteModal()
    .then((place) => {
		console.log(place);
		// place represents user's selection from the
        // suggestions and it is a simplified Google Place object.
        const region = Object.assign({},this.state.region,
            { latitude : place.location.latitude,
              longitude : place.location.longitude,
              latitudeDelta: 0.004757,
              longitudeDelta: 0.006866,
           })
        const latlng = Object.assign({}, this.state.markers.latlng,{
            latitude : place.location.latitude,
           longitude : place.location.longitude,
        })
        const markers = Object.assign({}, this.state.markers,
        {
            latlng : latlng,
            title : place.name,
        })
        this.setState({
            address : place.address,
            region,
            markers,
            place_name : place.name,
            address_array : place.address.split(' ')
        })
    })
    .catch(error => console.log(error.message));  // error is a Javascript Error object
  }


    getCurrentPosition() {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const region = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: 0.004757,
                        longitudeDelta: 0.006866
                    }
                    
                    this.setState({
                        region
                    })
                }
            )
    }

    getAdd(data){
        const region = Object.assign({},this.state.region,
             { latitude : data.geometry.location.lat,
               longitude : data.geometry.location.lng,
               latitudeDelta: 0.004757,
               longitudeDelta: 0.006866,
            })
        const latlng = Object.assign({}, this.state.markers.latlng,{
                latitude : data.geometry.location.lat,
               longitude : data.geometry.location.lng,
        })
        const markers = Object.assign({}, this.state.markers,
            {
                latlng : latlng,
                title : data.formatted_address,
            })
        this.setState(
            {
              region, //  selected coordinates longitute,
              markers,
              address : data.formatted_address,
              address_array : data.formatted_address.split(' ')
            }
          );
    }

    selectTeam = (team_name) => {

        firebase.database().ref('teams/').orderByChild('team_name').equalTo(team_name).once('value',snap => {
            snap.forEach(child => {
                this.setState({team : child.val()})
            })
        })
    }

    match = async() => {
        this.setState({loading : true})
        let type = '축구'
        const date = moment.tz('Asia/Seoul').format('MM월 DD일 HH:mm')
        {
            this.state.checkedSoccer ? type = '축구' : type = '풋살'
        }
        await firebase.database().ref('match').push({
            team_name : this.state.team_name,
            minNum : this.state.minNum,
            cost : this.state.cost,
            region : this.state.region,
            address : this.state.address,
            type : type,
            info : this.state.info,
            create_date : date,
            match_date : this.state.match_date,
            city : this.state.address_array[1],
            team_url : this.state.team.url,
            team_captain : this.state.team.captain_uid,
            place_name : this.state.place_name
        })
        this.setState({loading : false})
        this.props.navigation.navigate('Match_main')
    }

    
    

    render() {
        return (
            <View style={styles.container}>
            <ScrollView style={{flex : 2}}>
                <View style={styles.input_container}>
                    { this.state.team ?
                    <View style={styles.avatar_container}>
                        <Avatar
                            size='large'
                            rounded
                            source={{ uri : this.state.team.url}}
                        />
                        <Text style={{margin : 7}}>{this.state.team.team_name}</Text>    
                    </View>
                     : null}
                    <View style={{ flexDirection : 'row', flex : 1, justifyContent : 'flex-start', margin : 10, alignItems : 'center'}}>
                        <Text style={{fontSize : 14, marginRight : 10, width : 70}}>팀 선택</Text>
                        <Picker
                            selectedValue={this.state.team_name}
                            style={{height : 20, width: 200}}
                            itemStyle={{fontSize : 12}}
                            onValueChange ={(itemValue, itemIndex) => {
                                this.setState({ team_name : itemValue})
                                this.selectTeam(itemValue)
                            }}>
                            {
                            this.state.teams.map((data,i) => {
                                return (
                                    <Picker.Item label={data} value={data} key={i}/>
                                )
                            })
                        } 
                        </Picker>
                        
                    </View>

                    <View style={{ flexDirection : 'row', flex : 1, justifyContent : 'flex-start', margin : 10, alignItems : 'center'}}>
                        <Text style={{fontSize : 14, marginRight : 10, width : 70}}>최소 인원</Text>
                        <TextInput 
                            style={{ height : 37, width : 50}}
                            onChangeText={(text) => this.setState({minNum : text})}
                            value={this.state.minNum}
                            keyboardType='number-pad'
                            placeholder='ex)13'
                        />
                        <Text>명</Text>
                    </View>
                    
                    <View style={{ flexDirection : 'row', flex : 1, justifyContent : 'flex-start', margin : 10, alignItems : 'center'}}>
                        <Text style={{fontSize : 14, marginRight : 10, width : 70}}>비용</Text>
                        <TextInput 
                            style={{ height : 37, width : 80}}
                            onChangeText={(text) => this.setState({cost : text})}
                            value={this.state.cost}
                            keyboardType='number-pad'
                            placeholder='ex) 13000'
                        />
                        <Text>원</Text>
                    </View>

                    <View style={{ flexDirection : 'row', flex : 1, justifyContent : 'flex-start', margin : 10, alignItems : 'center'}}>
                        <Text style={{fontSize : 14, marginRight : 10, width : 70}}>경기 날짜</Text>
                        <DatePicker
                            style={{width: 200, borderWidth : 0}}
                            date={this.state.match_date}
                            mode="datetime"
                            placeholder="날짜를 선택해 주세요"
                            format="YYYY-MM-DD HH:mm"
                            minDate="2019-01-01"
                            confirmBtnText="확인"
                            cancelBtnText="취소"
                            customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 15,
                                borderWidth : 0                            }
                            // ... You can check the source to find the other keys.
                            }}
                            onDateChange={(date) => {this.setState({match_date: date})}}
                        />
                    </View>

                    <View style={{ flexDirection : 'row', flex : 1, justifyContent : 'flex-start', margin : 10, alignItems : 'center'}}>
                        <Text style={{fontSize : 14, marginRight : 10, width : 70}}>내용</Text>
                        <TextInput 
                            style={{ height : 100, width : 230}}
                            onChangeText={(text) => this.setState({info : text})}
                            value={this.state.info}
                            placeholder = '내용을 입력해 주세요.'
                            multiline
                            numberOfLines={4}
                        />
                    </View>

                    <View style={{ flexDirection : 'row', flex : 1, justifyContent : 'flex-start', margin : 10, alignItems : 'center'}}>
                        <Text style={{fontSize : 14, marginRight : 10, width : 70}}>장소</Text>
                        <Text style={{fontSize : 14,width : 200}}>{this.state.place_name}</Text>
                        <Icon name='search' size={26} style ={{margin : 10}} onPress={() => this.openSearchModal()}/>
                    </View>

                    <View style={{ flexDirection : 'row', alignItems : 'center', justifyContent : 'center', margin : 10}}>
                        <CheckBox
                            containerStyle={{backgroundColor : '#fff', borderWidth : 0}}
                            center
                            title ='축구'
                            checked = {this.state.checkedSoccer}
                            onPress={()=> this.setState({ checkedSoccer : !this.state.checkedSoccer, checkedFutsal : false})}
                        />
                        <CheckBox
                            center
                            containerStyle={{backgroundColor : '#fff', borderWidth : 0}}
                            title ='풋살'
                            checked = {this.state.checkedFutsal}
                            onPress={()=> this.setState({ checkedFutsal : !this.state.checkedFutsal, checkedSoccer : false})}
                        />
                    </View>
                </View>

                <View style={{flex : 1, justifyContent : 'center',alignItems : 'center', marginBottom : 20}}>
                <View style={styles.map_container}>
                <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={styles.map}
                region={this.state.region}
                >
                <Marker
                coordinate={this.state.markers.latlng}
                title={this.state.markers.title}
                />
                </MapView>
                <View>
                </View>
                <View >
      </View>
                </View>
            </View>     
            </ScrollView>
            <Button
                title ='생성'
                style = {{width : width, marginTop : 20 ,justifyContent : 'flex-end'}}
                color = '#1c7ed6'
                onPress = {() => this.match()}
                loading = {this.state.loading}
                disabled = {(this.state.team_name === '') || (this.state.minNum === '') ||(this.state.info === '') ||(this.state.cost === '')||(this.state.match_date === '')||(this.state.address === '클릭하여 검색')||(this.state.checkedSoccer && this.state.checkedFutsal)}
            />
        </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1
    },
    map_container: {
        height: 250,
        width: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input_container : {
        flex : 2,
        margin : 20,
    },
    avatar_container : {
        alignItems : 'center',
        margin: 5,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
   });

export default Create_match;