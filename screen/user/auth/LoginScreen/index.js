import React, { Component } from 'react';
import { View, StyleSheet ,ImageBackground, Text} from 'react-native';
import { GoogleSignin } from 'react-native-google-signin';
import { AccessToken, LoginManager } from 'react-native-fbsdk'
import firebase from 'react-native-firebase'
import Icon from 'react-native-vector-icons/FontAwesome'

class LoginScreen extends Component {
    constructor(props){
        super(props)
        this.state = {
            email : '',
            password : '',
        }
    }

    onLoginWithFB = async () => {
        try {

            LoginManager.logOut()

            const result = await LoginManager.logInWithReadPermissions(['public_profile', 'email']);
        
            if (result.isCancelled) {
               return// Handle this however fits the flow of your app
            }
        
        
            // get the access token
            const data = await AccessToken.getCurrentAccessToken();
        
            if (!data) {
              throw new Error('Something went wrong obtaining the users access token'); // Handle this however fits the flow of your app
            }
        
            // create a new firebase credential with the token
            const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
        
            // login with credential
            const currentUser = await firebase.auth().signInWithCredential(credential);
        

        } catch (e) {
            console.error(e);
          }
    }

    onLoginWithGoogle = async () => {
            // Add any configuration settings here:
            await GoogleSignin.configure({
                webClientId : '1009831711257-vv4fj10crmq3u0p2opj63ifb8gj0ffuk.apps.googleusercontent.com',
                offlineAccess : false
            });
        
            try {
                // Add any configuration settings here:
                
                const data = await GoogleSignin.signIn();
            
                // create a new firebase credential with the token
                const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken)
                // login with credential
                const currentUser = await firebase.auth().signInWithCredential(credential);
            
              } catch (e) {
                console.error(e);
              }
    }

    render() {
        return (
            <View>
            <ImageBackground source={require('../../../../android/app/src/main/assets/image/login_background.png')}
            style={{width : '100%',height : '100%'}}>                
                <View style={styles.loginbutton}>
                    <Text style={{marginBottom : 10,fontSize : 14, fontFamily : 'netmarbleL', color : '#fff'}}>소셜계정으로 간편 로그인</Text>
                    <Icon.Button name='google' backgroundColor="#ff0000"  onPress={this.onLoginWithGoogle}>
                        구글 계정으로 로그인
                    </Icon.Button>
                    <Icon.Button name='facebook-official' backgroundColor="#3b5998" onPress={this.onLoginWithFB}>
                        페이스북 계정으로 로그인
                    </Icon.Button>  

                </View>
                </ImageBackground>

            </View>
        );
    }
}



const styles = StyleSheet.create({
    loginpage : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : "white"
    },
    loginform : {
        justifyContent : 'center',
        alignItems : 'center',
        flexDirection : 'column',
    },
    loginbutton : {
        flex : 1,
        flexDirection : 'column',
        margin : 50,
        justifyContent : 'center',
        marginTop : 200
    }
})

export default LoginScreen;