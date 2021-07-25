import { CachingActions } from "../redux/CachingSlice"
import { db } from "../firebase"
import firebase from "firebase"
import { getUserData } from "./User"
const pageContents = 10
export const getFeed = async (tag, changeFilter, dispatch, cache) => {
    try {
        let newData = null
        if (!cache.posts.length || changeFilter) {
            if (tag !== 'all')
                newData = await db.collection('posts').where('tag', '==', tag).limit(pageContents).orderBy('timestamp', 'desc').get()
            else
                newData = await db.collection('posts').limit(pageContents).orderBy('timestamp', 'desc').get()
        }
        else {
            if (tag !== 'all')
                newData = await db.collection('posts').where('tag', '==', tag).limit(pageContents).orderBy('timestamp', 'desc').startAfter(firebase.firestore.Timestamp.fromDate(new Date(cache.posts[cache.posts.length - 1].post.timestamp))).get()
            else
                newData = await db.collection('posts').limit(pageContents).orderBy('timestamp', 'desc').startAfter(firebase.firestore.Timestamp.fromDate(new Date(cache.posts[cache.posts.length - 1].post.timestamp))).get()
        }
        if (newData) {
            newData = newData.docs.map(post => ({ post: post.data(), id: post.id }))
            let authors = []
            let lastAuthIndex = !changeFilter ? cache.authorData.length : 0

            for (let i = 0; i < newData.length; i++) {
                const authorUid = newData[i].post.user
                let authIndi = cache.authorData.map(function (author) { return author.id; }).indexOf(authorUid)
                if (authIndi === -1) {
                    authIndi = authors.map(function (author) { return author.id; }).indexOf(authorUid)
                    if (authIndi === -1) {
                        const author = await getUserData(authorUid)
                        authors.push({ author, id: authorUid })
                        newData[i].authorIndex = lastAuthIndex;
                        lastAuthIndex++;
                    }
                    else
                        newData[i].authorIndex = authIndi + cache.authorData.length
                }
                else
                    newData[i].authorIndex = authIndi
                newData[i].post.timestamp = (new Date(newData[i].post.timestamp.seconds * 1000)).getTime()
                if (newData[i].post.lastUpdated)
                    newData[i].post.lastUpdated = (new Date(newData[i].post.lastUpdated.seconds * 1000)).getTime()
                if (!newData[i].post.liked)
                    newData[i].post.liked = []
            }
            if (changeFilter === true)
                dispatch(CachingActions.filterChange({ posts: newData }))
            else
                dispatch(CachingActions.updateCache({ posts: newData, authors }))
        }

    }
    catch (err) {
        throw err
    }
}

export const createNewPost = async (data) => {
    try {
        const response = await db.collection('posts').add(data)
        let tags = {
            all: firebase.firestore.FieldValue.increment(+1)
        }
        tags[data.tag] = firebase.firestore.FieldValue.increment(+1)
        await db.collection('counts').doc('posts').update({ ...tags })
        return response.id
    }
    catch (err) {
        throw err
    }

}

export const getNetCount = async (dispatch) => {
    try {
        const count = await db.collection('counts').doc('posts').get()
        dispatch(CachingActions.netPostsUpdater({ type: "firstRun", value: count.data() }))
    }
    catch (err) {
        throw err
    }
}
export const sendFeedback = async (data) => {
    try {
        await db.collection('feedbacks').add(data)
    }
    catch (err) {
        throw err
    }
}
export const newsletterSub = async (email) => {
    try {
        await db.collection('newsletterSub').doc().set({ email })
    }
    catch (err) {
        throw err
    }
}