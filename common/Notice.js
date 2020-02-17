import React, { Component } from 'react';
import {View, Text,Button,FlatList} from 'react-native'
import firebase from 'react-native-firebase'
import { ListItem,Overlay } from 'react-native-elements'
import CustomgoBackHeader from './CustomgoBackHeader'


class Notice extends Component {
    constructor(props){
        super(props)
        this.state = {
            admin : false,
            notice : [],
            visible : false,
            item : ''
        }
    }

    componentDidMount(){
        const uid = firebase.auth().currentUser.uid
        if(uid === 'rASOSE5brnXG4K7bYdCbUsYgjFt2')
            this.setState({admin : true})

        firebase.database().ref('notice').orderByKey().once('value',snap => {
            snap.forEach(child => {
                this.setState({ notice : this.state.notice.concat(child.val())})
            });
        })
    }

    static navigationOptions = ({navigation}) => ({
        header : <CustomgoBackHeader title={'공지사항'} navigation={()=> navigation.goBack()} />
    })

    render() {
        return (
            <View>
                
                <FlatList
                    data = {this.state.notice}
                    showsVerticalScrollIndicator= {false}
                    keyExtractor = {item => item.title}
                    renderItem={({item}) =>
                    <ListItem
                        containerStyle = {{ padding : 8, marginLeft : 6, marginRight : 6, marginTop : 5,borderRadius : 4, borderBottomWidth : 0.3 , borderColor : '#E6E6E6'}}
                        title = {item.title}
                        titleStyle = {{fontSize : 16, fontFamily : 'netmarbleM'}}
                        chevron                        
                        onPress ={() => this.setState({item : item, visible : true})}
                    />
                }
                />

                <Overlay
                    isVisible={this.state.visible}
                    onBackdropPress={() => this.setState({visible : false})}
                    width={300}
                    height={450}
                    >
                    <View>
                        <View style={{height : 50, width : 300, alignItems : 'center'}}>
                        <Text style={{fontSize : 16, fontFamily : 'netmarbleB'}}>{this.state.item.title}</Text>
                        </View>
                        <View style={{justifyContent : "center", alignItems : 'flex-end', borderBottomWidth : 0.3}}>
                            <Text style={{fontSize : 14, fontFamily : 'netmarbleB'}}>{this.state.item.date}</Text>
                        </View>
                        <View style={{height : 350, width : 280,marginTop : 10}}>
                        <Text style ={{fontSize : 14, fontFamily : 'netmarbleM'}}>{this.state.item.article}</Text>
                        </View>
                    </View>
                    </Overlay>
                {
                    this.state.admin ? <Button title= "글쓰기" onPress={() => this.props.navigation.navigate('NoticeWrite')}/> : null
                }
            </View>
        );
    }
}

export default Notice;