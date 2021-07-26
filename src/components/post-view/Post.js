import { useCallback, useEffect, useReducer, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { GetPost, LikeUpdater, savePost, updateApplication } from "../../apis/Post"
import PostType from '../UI/PostType/PostType'
import ObjCpy from '../../helpers/ObjCpy'
import { getUserData } from '../../apis/User'
import classes from './Post.module.css'
import Dropdown from '../UI/Dropdown/Dropdown'
import Linkify from 'react-linkify';
import { auth } from "../../firebase"
import parser from 'html-react-parser'
import { Link } from "react-router-dom"
import timeDifference from "../../helpers/DateChange"
import { CachingActions } from "../../redux/CachingSlice"
import EditPost from './EditPost'
import Comments from './Comments'
import { UserActions } from "../../redux/UserSlice"
import DeletePost from "./DeletePost"
import DefaultProfilePic from "../../helpers/DefaultProfilePic"
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner"
import LikeModal from "./LikeModal"
import DOMPurify from "dompurify"
import Button from "../UI/Button/Button"
let isFirstRun = true
const initialState = {
    post: null,
    author: null,
    isLiked: false,
    isCached: -1,
    isApplied: false
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
    else if (action.type === "applicationUpdate")
        updatedState.isApplied = action.value
    return updatedState
}
let likeDelay = null
const Post = () => {
    const postId = useParams().id
    const [postData, postDispatcher] = useReducer(postReducer, { ...initialState })
    const [error, errorStateUpdater] = useState(null)
    const [isOpenLike, likeModalStateUpdater] = useState(false)
    const [isEdit, editStateUpdater] = useState(false)
    const [openComments, commentsStateUpdater] = useState(false)
    const [isDelete, deleteModalState] = useState(false)
    const dispatch = useDispatch()
    const user = (useSelector(state => state.user))
    const cache = (useSelector(state => state.cache))
    useEffect(() => { return () => isFirstRun = true }, [])
    const getPost = useCallback(async () => {
        try {
            const post = await GetPost(postId)
            if (!post)
                throw new Error("This post doesnt exist")
            post.timestamp = (new Date(post.timestamp.seconds * 1000)).getTime()
            if (!post.liked)
                post.liked = []
            return post
        }
        catch (err) {
            throw err

        }
    }, [postId])
    useEffect(() => {
        postDispatcher({ type: "applicationUpdate", value: user.applied.includes(postId) })
    }, [user.applied, postId])
    let checkInCache = useCallback(async () => {
        try {
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
            errorStateUpdater("Something went wrong!")
        }

    }
    const likeHandler = async () => {
        let likeArr = [...postData.post.liked]
        if (!postData.isLiked)
            likeArr.unshift(auth.currentUser.uid)
        else
            likeArr.splice(likeArr.indexOf(auth.currentUser.uid), 1)
        try {
            postDispatcher({ type: "liked", likeArr })
            clearTimeout(likeDelay)
            likeDelay = setTimeout(async () => {
                await LikeUpdater(postId, likeArr)
                if (postData.isCached !== -1)
                    dispatch(CachingActions.postUpdate({ index: postData.isCached, data: { ...postData.post, liked: likeArr } }))

            }, 500)
        }
        catch (err) {
            errorStateUpdater(err.message)
        }
    }
    const applicationHandler = async () => {
        const applied = ObjCpy(user.applied)
        const isApplied = postData.isApplied
        try {
            if (isApplied)
                applied.splice(applied.findIndex(post => post === postId), 1)
            else applied.push(postId)
            postDispatcher({ type: "applicationUpdate", value: !isApplied })
            await updateApplication(applied)
        }
        catch (err) {
            postDispatcher({ type: "applicationUpdate", value: isApplied })
            errorStateUpdater("Something went wrong!")
        }
    }
    const componentDecorator = (href, text, key) => (
        <a href={href} key={key} target="_blank" rel="noreferrer">
            {text}
        </a>
    );
    if (error)
        return <p className={classes.error}>{error}</p>
    if (postData.post === null)
        return <div style={{ textAlign: "center" }}><LoadingSpinner /></div>
    let filters = []
    if (postData.post.user === auth.currentUser.uid)
        filters = [...filters, "Edit", "Delete"]
    if (!user.saved.includes(postId))
        filters = [...filters, "Save"]
    else
        filters = [...filters, "Remove from Saved"]
    return <>
        <LikeModal likes={postData.post.liked} isOpen={isOpenLike} onClose={likeModalStateUpdater.bind(this, false)} />
        <Link to="/" className={classes.goHome}><span>&lt;</span> Back to feed</Link>
        <DeletePost open={isDelete} onClose={deleteModalState.bind(this, false)} saveHandler={saveHandler} tag={postData.post.tag} isCached={postData.isCached} />
        <EditPost onClose={editStateUpdater.bind(this, false)} isOpen={isEdit} post={postData.post} isCached={postData.isCached} postDispatcher={postDispatcher} />
        <div className={classes.content}>
            <div className={classes.topBar}>
                <header className={classes.heading}>
                    <Link className={classes.author} to={{
                        pathname: `/user/${postData.post.user}`,
                        state: {
                            user: postData.author
                        }
                    }}>
                        <img src={postData.author.profile_image ? postData.author.profile_image : DefaultProfilePic(postData.author.username)} alt={postData.author.username} />
                        <h2>{postData.author.username}</h2>
                    </Link>
                    <div className={classes.postTitle}>
                        <h1>{postData.post.title}</h1>
                        <PostType tag={postData.post.tag} />
                        {["Internship", "Placement"].includes(postData.post.tag) && <Button onClick={applicationHandler}>{postData.isApplied ? <><i className="fas fa-check"></i>Applied</> : "Apply"}</Button>}
                        <time>{timeDifference(new Date(postData.post.timestamp))}</time>
                    </div>
                </header>
                <div className={classes.filterDiv}>
                    <Dropdown filters={filters} onClick={dropDownHandler} />
                </div>
            </div>
            <article className={classes.article}>
                <Linkify componentDecorator={componentDecorator}>{parser(DOMPurify.sanitize(postData.post.description))}</Linkify>
            </article>
            <div className={classes.postActions}>
                <div className={classes.likes}>
                    <button className={classes.likeCount} onClick={likeModalStateUpdater.bind(this, true)}>{parseInt(postData.post.liked.length / 1000) ? `${(postData.post.liked.length / 1000).toFixed(1)}k` : postData.post.liked.length} {postData.post.liked.length === 1 ? 'like' : 'likes'}</button>
                    <button className={`${classes.btn} ${postData.isLiked ? classes.active : ''}`} onClick={likeHandler}><i className="fas fa-thumbs-up"></i> Like</button>
                </div>
                <button className={`${classes.btn} ${openComments ? classes.active : ''}`} onClick={() => commentsStateUpdater(prevState => !prevState)}><i className="fas fa-comments"></i> Comments</button>
            </div>
            <Comments isOpen={openComments} />
        </div>
    </>
}
export default Post