const functions = require('firebase-functions');
const admin = require('firebase-admin')

exports.teamJoin = functions.database.ref('users/{uid}/teams/').onWrite(event => {
    const uuid = event.params.uid

    console.log('user uid', uuid)

    var ref = admin.database().ref(`users/${uuid}/token`)
    return ref.once('value', snap => {
        const payload = {
            notification : {
                title : '팀 가입',
                body : event.data.val().team_name + '팀에 가입 되었습니다!'
            }
        }

        admin.messaging().sendToDevice(snap.val(), payload)
    })
})