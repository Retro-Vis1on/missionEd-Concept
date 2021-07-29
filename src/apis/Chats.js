import { auth, db } from "../firebase";
import ObjCpy from "../helpers/ObjCpy";
import { getUserData } from "./User";
import firebase from "firebase";
export const getUsers = (updater, cache, allocator, prevState, newUser) => {
    let newPartner = ObjCpy(newUser)
    db.collection('chats').where('users', 'array-contains-any', [auth.currentUser.uid]).onSnapshot(async snap => {
        if (snap.empty) {
            allocator([])
            if (newPartner) {
                let curState = [{ id: -1, partner: { ...newPartner } }]
                newPartner = null
                return updater(curState)
            }
            return updater([])
        }
        let chats = (snap.docs.map(data => { return { id: data.id, data: data.data() } }));
        let messages = ObjCpy(prevState)
        let cleanChats = []
        for (let chat of chats) {
            let curPair = chat.data.users
            let partner = curPair[0] !== auth.currentUser.uid ? curPair[0] : curPair[1]
            let userData = cache.find(user => user.id === partner)
            if (!userData) {
                userData = messages.find(chat => chat.partner.id === partner)
                if (!userData) {
                    userData = await getUserData(partner)
                    if (!userData) {
                        continue;
                    }
                }
                else userData = userData.partner.userData
            }
            else
                userData = userData.author
            chat.partner = { userData, id: partner }
            if (!messages.find(message => message.id === chat.id))
                messages.unshift({ id: chat.id, partner: { userData, id: partner } })
            cleanChats.push(chat)
        }
        if (newPartner) {
            let isExist = cleanChats.find(chat => chat.partner.id === newPartner.id)
            if (!isExist)
                cleanChats.unshift({ id: -1, partner: { ...newPartner } })
            newPartner = null
        }
        allocator(messages)
        updater(cleanChats)
    })
}
export const connectChat = (id, updater) => {
    const unsub = db.collection(`chats/${id}/messages`).orderBy('timestamp', 'asc').onSnapshot(snap => {
        if (!snap.empty) {
            const messages = snap.docs.map(data => ({ data: data.data(), id: data.id }))
            updater((prevState) => ({ ...prevState, messages }));
        }
    })
    updater((prevState) => ({ ...prevState, unsub }));
}
export const createNewChat = async (partner) => {
    try {
        const response = await db.collection(`chats`).add({ users: [partner, auth.currentUser.uid] })
        return response.id
    }
    catch (err) {
        console.log(err)
    }
}
export const sendMessage = async (id, message) => {
    try {
        db.collection(`chats/${id}/messages`).add({
            message,
            sender: auth.currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
    } catch {
        throw new Error("Something went wrong!")
    }
}