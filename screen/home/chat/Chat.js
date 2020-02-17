import React from 'react'
import { Text } from 'react-native'
import { GiftedChat, Send } from 'react-native-gifted-chat'
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

    const receiver = this.props.navigation.getParam('receiver')

    
    const chatID = this.getChatID(uid,receiver)
    this.id = chatID


    firebase.database().ref('users/'+ uid +'/chat').orderByChild('chatID').equalTo(chatID).on('value',snap => {
      if(snap.val()){
        this.setState({exist : true})
      }
    })

    this.refOn(message => 
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
        })
      )
    );
  }

  refOn = callback => {

    firebase.database().ref('chat/' + this.id)
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
    if(!this.state.exist){
      //sender db
      firebase.database().ref('users/'+ this.state.userUid +'/chat').push({
        chatID : this.id,
        uid : this.props.navigation.getParam('receiver')
      })

      //receiver db
      firebase.database().ref('users/' + this.props.navigation.getParam('receiver') + '/chat').push({
        chatID : this.id,
        uid : this.state.userUid
      })
    }

    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      var today = new Date()
      var timestamp = today.toISOString()
      const message = {text, user, createdAt: timestamp, };
      firebase.database().ref('chat/'+this.id).push(message);
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
    header : <CustomgoBackHeader title={navigation.getParam('name')} navigation={()=> navigation.goBack()} />
})

  renderSend(props) {
    return(
      <Send
        {...props}
        containerStyle={{alignItems : 'center', justifyContent : 'center', marginRight : 5}}
      >
        <Text style={{fontSize : 14, fontFamily : 'handon', color : '#1c7ed6'}}>전송</Text>
      </Send>
    )
  }



  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.send}
        user={this.user}
        placeholder = "내용을 입력해 주세요"
        renderUsernameOnMessage = {true}
        renderSend = {this.renderSend}
      />
    )
  }
}

export default Chat