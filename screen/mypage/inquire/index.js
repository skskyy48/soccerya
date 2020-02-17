import React from 'react'
import {View, Text } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import firebase from 'react-native-firebase';
import CustomgoBackHeader from '../../../common/CustomgoBackHeader'


class Chat extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      messages: [],
      userUid : '',
      userUrl : '',
      name : '',
      exist : false,
    }
    this.id= ''
  }
  

  componentDidMount(){
    const uid = firebase.auth().currentUser.uid
    firebase.database().ref('users/' + uid).on('value',snap => {
      this.setState({ userUid : uid, userUrl : snap.val().photoURL, name : snap.val().nickname})
    })

    const receiver = "rASOSE5brnXG4K7bYdCbUsYgjFt2"

    
    const chatID = this.getChatID(uid,receiver)
    this.id = chatID

    this.refOn(message => 
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
        })
      )
    );
  }

  refOn = callback => {

    firebase.database().ref('inquire/' + this.id)
      .on('child_added', snapshot => 
        callback(this.parse(snapshot))
      )
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  get user() {
    return {
      name: this.state.name,
      avatar: this.state.userUrl,
      _id: this.state.userUid,
    };
  }


  send = messages => {

    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      var today = new Date()
      var timestamp = today.toISOString()
      const message = {text, user, createdAt: timestamp, };
      firebase.database().ref('inquire/'+this.id).push(message);
    }
  };

  parse = snapshot => {
    const { createdAt, text, user } = snapshot.val();
    const { key } = snapshot;
    const _id = key
    const message = {_id, createdAt, text, user};
    return message;
  };


  getChatID= (sender,receiver) => {
    if(sender < receiver){
      return sender+receiver
    }else{
      return receiver+sender
    }
  }
  
  static navigationOptions = ({navigation}) => ({
    header : <CustomgoBackHeader title={"1:1 문의"} navigation={()=> navigation.goBack()} />
})



  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.send}
        user={this.user}
        placeholder = "내용을 입력해 주세요"
        renderUsernameOnMessage = {true}
      />
    )
  }
}

export default Chat