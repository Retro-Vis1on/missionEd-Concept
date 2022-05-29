import { useCallback, useEffect, useReducer, useRef, useState } from "react"
import { useParams } from "react-router-dom";
import { getRepliesHandler, sendReply } from "../../../../apis/Post";
import classes from './Replies.module.css'
import ObjCpy from "../../../../helpers/ObjCpy";
import LoadingSpinner from "../../../UI/LoadingSpinner/LoadingSpinner";
import Reply from "./Reply";
import { UpdateNotificationForCoins } from "../../../../apis/NotificationApi";
import Alert from "../../../UI/Alert/Alert";
import { useSelector } from "react-redux";
import { auth } from "../../../../firebase";
import ReactGA from 'react-ga'
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
const Replies = (props) => {
  const [repliesData, dispatcher] = useReducer(reducer, { ...initialState })
  const [isLoading, loadingStateUpdater] = useState(false)
  const [isSubmit, submitStateUpdater] = useState(false)
  const [isValid, validStateUpdater] = useState(true)
  const [error, errorStateUpdater] = useState(null)
  const postId = useParams().id
  const comment = useRef()
  const coins = useSelector(state => state.user).coins
  const getReplies = useCallback(() => {
    loadingStateUpdater(true)
    unsubscribe = getRepliesHandler(postId, props.commentId, repliesData, dispatcher, loadingStateUpdater.bind(this, false))
  }, [postId, repliesData, props.commentId])
  useEffect(() => {
    return () => {
      firstLoad = true
      if (unsubscribe)
        unsubscribe()
    }
  }, [props])
  useEffect(() => {
    if (firstLoad && props.isOpen) {
      getReplies()
      firstLoad = false
    }
  }, [getReplies, props.isOpen])
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
      await sendReply(postId, props.commentId, newComment);
      ReactGA.event({
        category: 'User',
        action: 'Commented',
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
    <form onSubmit={submitHandler} className={classes.replyForm}>
      <input type="text" name="comment" ref={comment} placeholder="Leave a reply" className={`${classes.input} ${!isValid ? classes.invalid : ''}`} />
      <button disabled={isSubmit}><i className="fas fa-paper-plane"></i></button>
    </form>
    {isLoading || repliesData.commments === null ? <div style={{ textAlign: "center", padding: "35px 0" }}><LoadingSpinner /></div> : <ul className={classes.comments}>{repliesData.comments !== null && repliesData.comments.length > 0 ? repliesData.comments.map(commentData => <Reply commentId={props.commentId} comment={commentData} author={repliesData.authors[commentData.authorIndex].author} key={commentData.id} />) : <p className={classes.noComments}>There are no replies.</p>}</ul>}
  </>
}
export default Replies