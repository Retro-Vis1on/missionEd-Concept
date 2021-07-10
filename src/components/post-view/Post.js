import { useCallback, useEffect, useReducer, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory, useParams } from "react-router-dom"
import { deletePost, GetPost, LikeUpdater, savePost, updatePost } from "../../apis/Post"
import CenteredLoader from '../UI/LoadingSpinner/CenteredLoader'
import PostType from '../UI/PostType/PostType'
import ObjCpy from '../../helpers/ObjCpy'
import { getUserData } from '../../apis/User'
import classes from './Post.module.css'
import Dropdown from '../UI/Dropdown/Dropdown'
import Linkify from 'react-linkify';
import { auth } from "../../firebase"
import parser from 'html-react-parser'
import Default from './../../assets/default.jpg'
import { Link } from "react-router-dom"
import timeDifference from "../../helpers/DateChange"
import { CachingActions } from "../../redux/CachingSlice"
import EditPost from './EditPost'
import Comments from './Comments'
import { UserActions } from "../../redux/UserSlice"
import DeletePost from "./DeletePost"
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);
let isFirstRun = true
const initialState = {
    post: null,
    author: null,
    isLiked: false,
    isCached: -1
}
const postReducer = (state, action) => {
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
    return updatedState
}
const Post = () => {
    const postId = useParams().id
    const [postData, postDispatcher] = useReducer(postReducer, { ...initialState })
    const [isLoading, loadingStateUpdater] = useState(false)
    const [error, errorStateUpdater] = useState(null)
    const [isEdit, editStateUpdater] = useState(false)
    const [openComments, commentsStateUpdater] = useState(false)
    const [isDelete, deleteModalState] = useState(false)
    const dispatch = useDispatch()
    const history = useHistory()
    const user = (useSelector(state => state.user))
    const cache = (useSelector(state => state.cache))
    useEffect(() => { return () => isFirstRun = true }, [])
    const getPost = useCallback(async () => {
        try {
            const post = await GetPost(postId)
            post.timestamp = (new Date(post.timestamp.seconds * 1000)).getTime()
            if (!post.liked)
                post.liked = []
            if (post === undefined)
                throw new Error("This post doesnt exist")
            return post
        }
        catch (err) {
            throw err

        }
    }, [postId])
    let checkInCache = useCallback(async () => {
        try {
            loadingStateUpdater(true)
            let contentIndex = cache.posts.findIndex(post => post.id === postId)
            let post = null
            let isCached = -1
            if (contentIndex === -1)
                post = await getPost();
            else {
                post = cache.posts[contentIndex].post
                isCached = contentIndex
            }
            let author = null
            if (isCached !== -1)
                author = cache.authorData[cache.posts[contentIndex].authorIndex].author
            else {
                let authorIndi = cache.authorData.findIndex(author => author.id === post.user)
                if (authorIndi === -1)
                    author = await getUserData(post.user)
                else
                    author = cache.authorData[authorIndi].author
            }
            postDispatcher({ type: "freshLoad", post, author, isLiked: post.liked.includes(auth.currentUser.uid), isCached })
        }
        catch (err) {
            errorStateUpdater(err.message)
            console.log(err)
        }
        finally {
            loadingStateUpdater(false)
        }
    }, [cache, postId, getPost])
    useEffect(() => {
        if (!isFirstRun)
            return
        checkInCache()
        isFirstRun = false
    }, [checkInCache])
    const dropDownHandler = (option) => {
        if (option === "Edit")
            editStateUpdater(true)
        else if (option.includes("Save"))
            saveHandler()
        else if (option === "Delete")
            deleteModalState(true)
    }
    const saveHandler = async () => {
        let saveArr = [...user.saved];
        let postIndex = saveArr.findIndex(id => id === postId)
        if (postIndex !== -1)
            saveArr.splice(postIndex, 1)
        else
            saveArr.push(postId)
        try {
            await savePost(saveArr)
            dispatch(UserActions.userDataUpdater({ ...(user), saved: saveArr }))
        }
        catch (err) {
            console.log(err)
        }

    }
    const deleteHandler = async () => {
        try {
            loadingStateUpdater(true)
            await deletePost(postId, postData.post.tag)
            if (user.saved.includes(postId))
                await saveHandler()
            if (postData.isCached !== -1) {
                dispatch(CachingActions.deletePost({ index: postData.isCached }))
                dispatch(CachingActions.netPostsUpdater({ type: "delPost", tag: postData.post.tag }))
            }
            history.replace('/')
        }
        catch (err) {
            loadingStateUpdater(false)
            console.log(err)
        }
    }
    const editHandler = async (data) => {
        try {
            loadingStateUpdater(true)
            let oldTag = postData.post.tag
            let newTag = data.tag
            await updatePost(postId, data);
            data.lastUpdated = (new Date(data.timestamp.seconds * 1000)).getTime()
            if (postData.isCached !== -1) {
                dispatch(CachingActions.postUpdate({ index: postData.isCached, data: { ...postData.post, ...data } }))
                dispatch(CachingActions.netPostsUpdater({ type: "updatePost", oldTag, newTag }))
            }
            postDispatcher({ type: "update", data })
            editStateUpdater(false)
        }
        catch (err) {
            errorStateUpdater(err.message)
            console.log(err)
        }
        finally {
            loadingStateUpdater(false)
        }
    }
    const likeHandler = async () => {
        let likeArr = [...postData.post.liked]
        if (!postData.isLiked)
            likeArr.push(auth.currentUser.uid)
        else
            likeArr.splice(likeArr.indexOf(auth.currentUser.uid), 1)
        try {
            postDispatcher({ type: "liked", likeArr })
            await LikeUpdater(postId, likeArr)

            if (postData.isCached !== -1)
                dispatch(CachingActions.postUpdate({ index: postData.isCached, data: { ...postData.post, liked: likeArr } }))

        }
        catch (err) {
            errorStateUpdater(err.message)
            console.log(err)
        }
    }
    const componentDecorator = (href, text, key) => (
        <a href={href} key={key} target="_blank" rel="noreferrer">
            {text}
        </a>
    );
    if (error)
        return <p>{error}</p>
    if (postData.post === null)
        return <CenteredLoader />
    let filters = []
    if (postData.post.user === auth.currentUser.uid)
        filters = [...filters, "Edit", "Delete"]
    if (!user.saved.includes(postId))
        filters = [...filters, "Save"]
    else
        filters = [...filters, "Remove from Saved"]
    return <>
        <Link to="/" className={classes.goHome}><span>&lt;</span> Back to feed</Link>
        <DeletePost open={isDelete} deleteHandler={deleteHandler} onClose={deleteModalState.bind(this, false)} isLoading={isLoading} />
        <EditPost onClose={editStateUpdater.bind(this, false)} isLoading={isLoading} editHandler={editHandler} isOpen={isEdit} post={postData.post} />
        <div className={classes.content}>
            <div className={classes.topBar}>
                <div className={classes.heading}>
                    <Link to={`/user/${postData.post.user}`} className={classes.author}>
                        <img src={postData.author.profile_image ? postData.author.profile_image : Default} alt={postData.author.username} />
                        <h2>{postData.author.username}</h2>
                    </Link>
                    <div className={classes.postTitle}>
                        <h1>{postData.post.title}</h1>
                        <PostType tag={postData.post.tag} />
                        <time>{timeDifference(new Date(postData.post.timestamp))}</time>
                    </div>
                </div><div className={classes.filterDiv}>
                    <Dropdown filters={filters} onClick={dropDownHandler} />
                </div>
            </div>
            <article>
                <Linkify componentDecorator={componentDecorator}>{parser(DOMPurify.sanitize(postData.post.description))}</Linkify>
            </article>
            <div className={classes.postActions}>
                <div className={classes.likes}>
                    <p>{parseInt(postData.post.liked.length / 1000) ? `${(postData.post.liked.length / 1000).toFixed(1)}k` : postData.post.liked.length} {postData.post.liked.length === 1 ? 'like' : 'likes'}</p>
                    <button className={`${classes.btn} ${postData.isLiked ? classes.active : ''}`} onClick={likeHandler}><i className="fas fa-thumbs-up"></i> Like</button>
                </div>
                <button className={`${classes.btn} ${openComments ? classes.active : ''}`} onClick={() => commentsStateUpdater(prevState => !prevState)}><i className="fas fa-comments"></i> Comments</button>
            </div>
            <Comments isOpen={openComments} />
        </div>
    </>
}
export default Post