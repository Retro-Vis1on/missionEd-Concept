import { useCallback, useEffect, useReducer, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import PostType from '../UI/PostType/PostType'
import classes from './Post.module.css'
import Dropdown from '../UI/Dropdown/Dropdown'
import Linkify from 'react-linkify';
import { auth } from "../../firebase"
import parser from 'html-react-parser'
import { Link } from "react-router-dom"
import timeDifference from "../../helpers/DateChange"
import EditPost from './PostActions/EditPost'
import Comments from './Comments/Comments'
import DeletePost from "./PostActions/DeletePost"
import DefaultProfilePic from "../../helpers/DefaultProfilePic"
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner"
import LikeModal from "./PostActions/LikeModal"
import DOMPurify from "dompurify"
import Button from "../UI/Button/Button"
import ReactGa from 'react-ga'
import { applicationFunction, CacheHandler, initialState, PostLike, postReducer, saveUpdater } from "./PostHelpers"
let isFirstRun = true
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
    useEffect(() => {
        ReactGa.pageview(window.location.pathname)
        return () => isFirstRun = true
    }, [])
    useEffect(() => {
        postDispatcher({ type: "applicationUpdate", value: user.applied.includes(postId) })
    }, [user.applied, postId])
    let checkInCache = useCallback(async () => {
        try {
            await CacheHandler(cache, postId, auth.currentUser.uid, postDispatcher)
        }
        catch (err) {
            errorStateUpdater(err.message)
        }
    }, [cache, postId])
    useEffect(() => {
        if (isFirstRun)
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
        try {
            saveUpdater(user, postId, auth.currentUser.uid, dispatch)
        }
        catch (err) {
            errorStateUpdater("Something went wrong!")
        }

    }
    const likeHandler = async () => {
        try {
            await PostLike(postData, postId, auth.currentUser.uid, postDispatcher, dispatch)
        }
        catch (err) {
            errorStateUpdater(err.message)
        }
    }
    const applicationHandler = async () => {
        const isApplied = postData.isApplied
        try {
            await applicationFunction(postData, user.applied, postId, postDispatcher, auth.currentUser.uid)
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
        <LikeModal likes={postData.post.liked} isOpen={isOpenLike} onClose={likeModalStateUpdater.bind(this, false)} postId={postId} />
        <Link to="/" className={classes.goHome}><span>&lt;</span> Back to feed</Link>
        <DeletePost open={isDelete} onClose={deleteModalState.bind(this, false)} saveHandler={saveHandler} tag={postData.post.tag} isCached={postData.isCached} />
        <EditPost onClose={editStateUpdater.bind(this, false)} isOpen={isEdit} post={postData.post} isCached={postData.isCached} postDispatcher={postDispatcher} />
        <div className={classes.content}>
            <div className={classes.topBar}>
                <header className={classes.heading}>
                    <Link className={classes.author} to={{
                        pathname: `/user/${postData.post.user}`,
                        state: {
                            user: postData.author.isDeleted ? null : postData.author
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