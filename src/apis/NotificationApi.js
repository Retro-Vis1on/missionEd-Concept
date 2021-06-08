import firebase from 'firebase'
import {userdb, db} from '../firebase'

//condition for notification 
// 1. getting coins by commenting , creating post, messsaging someone
// 2. when someone started following you

// const notifications=[
//     {msg:'hey you get 10 Coins for creating post !!'},
//     {msg:'hey you get 2 coins for commenting!!'},
//     {msg:'hey you get 5 coins for messaging'},
//     {msg:'Started following you!'},
// ]
export async function UpdateNotificationForCoins(uid, coins, reason){
    try{
       await db.collection(`users/${uid}/notifications`).add({
           msg: `hey you get ${coins} coins for ${reason}`,
           seen:false,
           timestamp: firebase.firestore.FieldValue.serverTimestamp(),
           coins:true,
       })
    }
    catch{
        console.log('error in updating coins');
        return 'error in updating coins'
    }
}

export async function UpdateNotificationForFollowers(uid, username, uid2){
    try{
       await db.collection(`users/${uid2}/notifications`).add({
           msg: `${username} started following you`,
           seen:false,
           timestamp: firebase.firestore.FieldValue.serverTimestamp(),
           coins:false,
           follower: uid,
       })
    }
    catch{
        console.log('error in updating coins');
        return 'error in updating coins'
    }
}



