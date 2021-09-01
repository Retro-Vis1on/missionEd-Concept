import { useCallback, useEffect, useReducer, useRef, useState } from "react"
import { useParams } from "react-router-dom";
import { getCommentsHandler, sendComment } from "../../../apis/Post";
import classes from './Comments.module.css'
import ObjCpy from "../../../helpers/ObjCpy";
import LoadingSpinner from "../../UI/LoadingSpinner/LoadingSpinner";
import Comment from "./Comment";
import ReactGA from 'react-ga'
import Alert from "../../UI/Alert/Alert";
import { UpdateNotificationForCoins } from "../../../apis/NotificationApi";
import { useSelector } from "react-redux";
import { auth } from "../../../firebase";
const initialState = {
  comments: null,
  authors: [],
}
const reducer = (state, action) => {
  const updatedState = ObjCpy(state)
  updatedState.comments = action.comments
  updatedState.authors = action.authors
  return updatedState
}
let firstLoad = true
let timer = null
let unsubscribe = null;
const Comments = (props) => {
  const [commentsData, dispatcher] = useReducer(reducer, { ...initialState })
  const [isLoading, loadingStateUpdater] = useState(false)
  const [isSubmit, submitStateUpdater] = useState(false)
  const [isValid, validStateUpdater] = useState(true)
  const [error, errorStateUpdater] = useState(null)
  const postId = useParams().id
  const comment = useRef()
  const coins = useSelector(state => state.user).coins
  const getComments = useCallback(() => {
    loadingStateUpdater(true)
    unsubscribe = getCommentsHandler(postId, commentsData, dispatcher, loadingStateUpdater.bind(this, false))
  }, [postId, commentsData])
  useEffect(() => {
    return () => {
      firstLoad = true
      if (unsubscribe !== null)
        unsubscribe()
    }
  }, [])
  useEffect(() => {
    if (firstLoad && props.isOpen) {
      getComments()
      firstLoad = false
    }
  }, [getComments, props.isOpen])
  const submitHandler = async (event) => {
    event.preventDefault();
    const newComment = comment.current.value
    if (!newComment.length) {
      clearTimeout(timer)
      validStateUpdater(false)
      timer = setTimeout(() => validStateUpdater(true), 1500)
      return;
    }
    try {
      submitStateUpdater(true)
      await sendComment(postId, newComment);
      ReactGA.event({
        category: 'Post',
        action: 'New Comment',
        value: {
          uid: auth.currentUser.uid,
          postId
        }
      })
      UpdateNotificationForCoins("commenting", coins)
      comment.current.value = ""
    }
    catch (err) {
      errorStateUpdater("Sorry! Something went wrong on our end.")
    }
    finally {
      submitStateUpdater(false)
    }

  }
  if (!props.isOpen)
    return null
  return <>
    <Alert error={error} onClose={errorStateUpdater.bind(this, null)} />
    <form onSubmit={submitHandler} className={classes.commentForm}>
      <input type="text" name="comment" ref={comment} placeholder="Write a comment" className={`${classes.input} ${!isValid ? classes.invalid : ''}`} disabled={isSubmit} />
      <button disabled={isSubmit}><i className="fas fa-paper-plane"></i></button>
    </form>
    {isLoading || commentsData.commments === null ? <div style={{ textAlign: "center", padding: "35px 0" }}><LoadingSpinner /></div> : <ul className={classes.comments}>{commentsData.comments !== null && commentsData.comments.length > 0 ? commentsData.comments.map(commentData => <> <Comment comment={commentData} author={commentsData.authors[commentData.authorIndex].author} key={commentData.id} postId={postId}/> </> ) : <p className={classes.noComments}>There are no comments</p>}</ul>}
  </>
}
export default Comments