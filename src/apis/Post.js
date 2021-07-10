import { auth, db } from "../firebase"
import { getUserData } from "./User"
import ObjCpy from '../helpers/ObjCpy'
import firebase from "firebase"
export const GetPost = async (id) => {
    try {
        const response = await db.collection('posts').doc(id).get()
        return response.data()
    }
    catch (err) {
        throw err
    }
}
export const LikeUpdater = async (id, liked) => {
    try {
        await db.collection('posts').doc(id).update({ liked })
    }
    catch (err) {
        throw err
    }
}
export const updatePost = async (id, data) => {
    try {
        await db.collection('posts').doc(id).update(data)
    }
    catch (err) {
        throw err
    }
}
export const savePost = async (saved) => {
    try {
        await db.collection('users').doc(auth.currentUser.uid).update({
            saved
        })
    }
    catch (err) {
        throw err
    }
}
export const deletePost = async (id, tag) => {
    try {
        let tags = {
            all: firebase.firestore.FieldValue.increment(-1)
        }
        tags[tag] = firebase.firestore.FieldValue.increment(-1)
        await db.collection('posts').doc(id).delete();
        await db.collection('counts').doc('posts').update({ ...tags })
    }
    catch (err) {
        throw err
    }
}
export const getCommentsHandler = (id, commentsData, dispatcher, stopLoad) => {
    let unsubscribe = db.collection(`posts/${id}/comments`).orderBy('timestamp', 'desc').onSnapshot({ includeMetadataChanges: true }, async (snap) => {

        let comments = []
        let authors = []
        let cachedAuthors = ObjCpy(commentsData.authors)
        let lastAuthorIndi = 0
        comments = snap.docs.map(data => { return { id: data.id, data: data.data() } })
        for (let i = 0; i < comments.length; i++) {
            let authorId = comments[i].data.user
            let curAuthorIdx = authors.findIndex((curAuth) => curAuth.id === authorId)
            if (curAuthorIdx === -1) {
                let author = cachedAuthors.find((curAuth) => curAuth.id === authorId)
                if (!author) {
                    let newAuthor = await getUserData(authorId)
                    authors.push({ author: newAuthor, id: authorId })
                    comments[i].authorIndex = lastAuthorIndi
                    lastAuthorIndi++
                }
                else {
                    authors.push({ author, id: authorId })
                    comments[i].authorIndex = lastAuthorIndi
                    lastAuthorIndi++
                }
            }
            else comments[i].authorIndex = curAuthorIdx
        }
        dispatcher({ comments, authors })
        stopLoad()
    });
    return unsubscribe
}
export const sendComment = async (id, comment) => {
    try {
        await db.collection(`posts/${id}/comments`).add({
            user: auth.currentUser.uid,
            comment,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
    }
    catch (err) {
        throw err
    }
}