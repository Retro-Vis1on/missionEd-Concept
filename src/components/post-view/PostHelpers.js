import { GetPost, LikeUpdater, savePost, updateApplication } from "../../apis/Post";
import ReactGa from 'react-ga'
import { UserActions } from "../../redux/UserSlice";
import { getUserData } from "../../apis/User";
import { NotificationForLike } from "../../apis/NotificationApi";
import { CachingActions } from "../../redux/CachingSlice";
import ObjCpy from "../../helpers/ObjCpy";

export const CacheHandler = async (cache, postId, uid, dispatcher) => {
    let contentIndex = cache.posts.findIndex(post => post.id === postId)
    let post = null
    let isCached = -1
    if (contentIndex === -1)
        post = await PostFetch();
    else {
        post = cache.posts[contentIndex].post
        isCached = contentIndex
    }
    let author = null
    if (isCached !== -1)
        author = cache.authorData[cache.posts[contentIndex].authorIndex].author
    else {
        let authorIndi = cache.authorData.findIndex(author => author.id === post.user)
        if (authorIndi === -1) {
            author = await getUserData(post.user)
            if (!author)
                author = { username: "Deleted", isDeleted: true }
        }
        else
            author = cache.authorData[authorIndi].author
    }
    dispatcher({ type: "freshLoad", post, author, isLiked: post.liked.includes(uid), isCached })
}


export const PostFetch = async (postId) => {
    const post = await GetPost(postId)
    if (!post)
        throw new Error("This post doesn't exist")
    post.timestamp = (new Date(post.timestamp.seconds * 1000)).getTime()
    if (!post.liked)
        post.liked = []
    return post
}

export const saveUpdater = async (user, postId, uid, dispatch) => {
    let saveArr = [...user.saved];
    let postIndex = saveArr.findIndex(id => id === postId)
    if (postIndex !== -1)
        saveArr.splice(postIndex, 1)
    else
        saveArr.push(postId)

    await savePost(saveArr)
    ReactGa.event({
        category: 'Post',
        action: 'Saved Post',
        value: {
            uid,
            postId
        }
    })
    dispatch(UserActions.userDataUpdater({ ...(user), saved: saveArr }))
}
let likeDelay = null
export const PostLike = async (postData, postId, uid, postDispatcher, dispatch) => {
    let likeArr = [...postData.post.liked]
    if (!postData.isLiked)
        likeArr.unshift(uid)
    else
        likeArr.splice(likeArr.indexOf(uid), 1)
    postDispatcher({ type: "liked", likeArr })
    clearTimeout(likeDelay)
    likeDelay = setTimeout(async () => {
        await LikeUpdater(postId, likeArr)
        if (!postData.isLiked) {
            ReactGa.event({
                category: 'Post',
                action: 'Liked Post',
                value: {
                    uid: uid,
                    postId
                }
            })
            NotificationForLike(postData.post.user, postId)
        }
        if (postData.isCached !== -1)
            dispatch(CachingActions.postUpdate({ index: postData.isCached, data: { ...postData.post, liked: likeArr } }))

    }, 500)
}

export const applicationFunction = async (postData, applications, postId, postDispatcher, uid) => {
    const applied = ObjCpy(applications)
    const isApplied = postData.isApplied
    if (isApplied)
        applied.splice(applied.findIndex(post => post === postId), 1)
    else applied.push(postId)
    postDispatcher({ type: "applicationUpdate", value: !isApplied })
    await updateApplication(applied)
    if (isApplied) {
        ReactGa.event({
            category: 'Application',
            action: 'Removed application',
            value: {
                uid: uid,
                postId,
                tag: postData.post.tag
            }
        })
    }
    else {
        ReactGa.event({
            category: 'Application',
            action: 'Applied',
            value: {
                uid: uid,
                postId,
                tag: postData.post.tag
            }
        })
    }
}
export const postReducer = (state, action) => {
    let updatedState = ObjCpy(state)
    if (action.type === "freshLoad") {
        updatedState.post = action.post
        updatedState.author = action.author
        updatedState.isLiked = action.isLiked
        updatedState.isCached = action.isCached
    }
    else if (action.type === "update") {
        updatedState.post = { ...(updatedState.post), ...(action.data) }
    }
    else if (action.type === "liked") {
        updatedState.isLiked = !updatedState.isLiked
        updatedState.post.liked = action.likeArr
    }
    else if (action.type === "applicationUpdate")
        updatedState.isApplied = action.value
    return updatedState
}
export const initialState = {
    post: null,
    author: null,
    isLiked: false,
    isCached: -1,
    isApplied: false
}