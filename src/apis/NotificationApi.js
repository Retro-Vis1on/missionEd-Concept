import { auth, db, firebase } from '../firebase'
//condition for notification 
// 1. getting coins by commenting , creating post, messsaging someone
// 2. when someone started following you

// const notifications=[
//     {msg:'hey you get 10 Coins for creating post !!'},
//     {msg:'hey you get 2 coins for commenting!!'},
//     {msg:'hey you get 5 coins for messaging'},
//     {msg:'Started following you!'},
// ]
export async function UpdateNotificationForCoins(reason, prevCoins) {
    try {
        const coins = {
            "creating post": 10,
            commenting: 2,
            "sign up": 5
        }

        db.collection(`users/${auth.currentUser.uid}/notifications`).add({
            msg: `Hey, you got ${coins[reason]} coins for ${reason}`,
            seen: false,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            coins: true,
        })
        const updatedCoins = +prevCoins + coins[reason]
        db.collection('users').doc(auth.currentUser.uid).update({ coins: updatedCoins })
    }
    catch {
        console.log('error in updating coins');
    }
}

export async function UpdateNotificationForFollowers(user) {
    try {
        await db.collection(`users/${user}/notifications`).add({
            msg: `started following you`,
            seen: false,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            coins: false,
            follower: auth.currentUser.uid,
        })
    }
    catch {
        console.log('error in updating coins');
    }
}

export async function NotificationForLike(owner, id) {
    try {
        await db.collection(`users/${owner}/notifications`).add({
            msg: `liked your post!`,
            postId: id,
            seen: false,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            coins: false,
            follower: auth.currentUser.uid,
        })
    }
    catch {
        console.log('error in updating coins');
    }
}



