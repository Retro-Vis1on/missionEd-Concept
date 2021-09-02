import { auth, db, provider, storage, userdb } from "../firebase"
import ObjCpy from "../helpers/ObjCpy"
import { NotificationsActions } from "../redux/NotificationSlice"
import { UserActions } from "../redux/UserSlice"
import { UpdateNotificationForCoins } from "./NotificationApi"
import ReactGa from 'react-ga'
export const userProfile = (uid, dispatch, cache) => {
    try {
        dispatch(UserActions.onLoad())
        let unsubscribeUser = db.collection('users').doc(uid).onSnapshot({ includeMetadataChanges: true }, async (snap) => {
            if (snap.exists)
                dispatch(UserActions.userLogin({ ...(snap.data()) }))
        })
        let unsubscribeNotification = db.collection('users').doc(uid).collection('notifications').onSnapshot({ includeMetadataChanges: true }, async (snap) => {

            if (!snap.empty) {
                let notifications = []
                let users = []
                for (let notification of snap.docs) {
                    let curNot = ObjCpy(notification.data())
                    if (curNot.timestamp)
                        curNot.timestamp = (new Date(curNot.timestamp.seconds * 1000)).getTime()
                    if (curNot.follower) {
                        const uid = curNot.follower

                        let user = cache.find(cur => cur.id === uid)
                        if (!user) {
                            users.find(cur => cur.uid === uid)
                            if (!user) {
                                user = await getUserData(uid)
                                users.push({ user, uid })
                            }
                            else user = user.user
                        }
                        else {
                            user = user.author
                        }
                        curNot.follower = ObjCpy({ user, uid })
                    }
                    notifications.push({ data: curNot, id: notification.id })
                }
                dispatch(NotificationsActions.updateNotifications({ notifications }))
            }
        })
        return () => {
            unsubscribeUser()
            unsubscribeNotification()
        }
    }
    catch (err) {
        throw err
    }
}


export const updateProfile = async (data) => {
    try {
        const user = await userdb.where('username', '==', data.username).get()
        if (!user.empty){
            throw new Error('This username already exists!')
            console.log("Already")
        }
        else{
            await db.collection('users').doc(auth.currentUser.uid).update({ ...data })
        }
    }
    catch (err) {
        throw err
    }

}

export const updatePassword = async (data) => {
    try {
        await auth.currentUser.reauthenticateWithCredential(auth.EmailAuthProvider.credential(auth.currentUser.email, data.oldPassword))
        await auth.currentUser.updatePassword(data.newPassword)
    }
    catch (err) {
        throw err
    }
}

export const updaterProfilePic = async (file) => {
    try {
        await storage.ref(`/profile_images/${file.name}`).put(file)
        const url = await storage.ref('profile_images').child(file.name).getDownloadURL()
        await db.collection('users').doc(auth.currentUser.uid).update({ profile_image: url })
        await auth.currentUser.updateProfile({
            photoURL: url
        })
    }
    catch (err) {
        throw err
    }
}

export const getUserPosts = async (uid) => {
    try {
        const posts = (await db.collection('posts').where('user', '==', uid).limit(5).get()).docs
        return posts
    }
    catch (err) {
        throw err
    }
}

export const getFollowers = async (uid) => {
    try {
        const followers = (await userdb.where('following', 'array-contains-any', [uid]).get()).docs
        return followers
    }
    catch (err) {
        throw err
    }
}

export const followingUpdater = async (following) => {
    try {
        await db.collection('users').doc(auth.currentUser.uid).update({ following })
    }
    catch (err) {
        throw err
    }

}
export const markAsSeen = async (notifications) => {
    try {
        for (let notification of notifications)
            await db.collection('users').doc(auth.currentUser.uid).collection('notifications').doc(notification.id).update({
                seen: true
            })
    }
    catch (err) {
        throw err
    }
}
export const deleteNotification = async (id) => {
    try {
        await db.collection('users').doc(auth.currentUser.uid).collection('notifications').doc(id).delete();
    }
    catch (err) {
        throw err
    }
}
export const getRecommentdations = async (filter, limit = 10) => {
    try {
        const recommends = (await userdb.limit(limit).where('username', 'not-in', filter).get()).docs
        return recommends
    }
    catch (err) {
        throw err
    }
}
export const getUserData = async (uid) => {
    try {
        const data = (await db.collection('users').doc(uid).get())
        return data.data()
    }
    catch (err) {
        throw err
    }
}
export const Login = async (email, password) => {
    try {
        await auth.signInWithEmailAndPassword(email, password)
    }
    catch (err) {
        throw err
    }
}
export const signUpWithEmail = async (email, password) => {
    try {
        await auth.createUserWithEmailAndPassword(email, password)
    }
    catch (err) {
        throw err
    }
}
export const loginWithGoogle = async () => {
    try {
        await auth.signInWithPopup(provider)
        const data = await getUserData(auth.currentUser.uid)
        if (!data)
            return false
        return true
    }
    catch (err) {
        throw err
    }
}
export const createUser = async (data) => {
    try {
        const user = await userdb.where('username', '==', data.username).get()
        if (!user.empty)
            throw new Error('This username already exists!')
        await userdb.doc(auth.currentUser.uid).set({
            ...data,
            email: auth.currentUser.email,
            coins: 5,
            saved: [],
            following: []
        })
        await auth.currentUser.updateProfile({
            displayName: data.username
        })
        ReactGa.event({
            category: 'User',
            action: 'New User',
            value: {
                uid: auth.currentUser.uid,
            }
        })
        UpdateNotificationForCoins('sign up');
    }
    catch (err) {
        throw err
    }
}
export const resetPassword = async (email) => {
    try {
        await auth.sendPasswordResetEmail(email)
    }
    catch (err) {
        throw err
    }
}