import { useCallback, useEffect, useReducer, useRef, useState } from "react"
import { useParams } from "react-router-dom";
import { getRepliesHandler, sendReply } from "../../apis/Post";
import classes from './Replies.module.css'
import ObjCpy from "../../helpers/ObjCpy";
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner";
import Reply from "./Reply";
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
  const comment = useRef()
  const [isLoading, loadingStateUpdater] = useState(false)
  const [isSubmit, submitStateUpdater] = useState(false)
  const [isValid, validStateUpdater] = useState(true)
  const postId = useParams().id

  const getReplies = useCallback(() => {
    loadingStateUpdater(true)
    unsubscribe = getRepliesHandler(postId, props.commentID.comment.id, repliesData, dispatcher, loadingStateUpdater.bind(this, false))
  }, [postId, repliesData, props.commentID.comment.id])
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
      await sendReply(postId, props.commentID.comment.id, newComment);
      comment.current.value = ""
    }
    catch (err) {
      console.log(err)
    }
    finally {
      submitStateUpdater(false)
    }

  }
  if (!props.isOpen)
    return null
  return <>

    <form onSubmit={submitHandler} className={classes.replyForm}>
      <input type="text" name="comment" ref={comment} placeholder="Add a reply" className={`${classes.input} ${!isValid ? classes.invalid : ''}`} />
      <button disabled={isSubmit}><i className="fas fa-paper-plane"></i></button>
    </form>
    {isLoading || repliesData.commments === null ? <div style={{ textAlign: "center", padding: "35px 0" }}><LoadingSpinner /></div> : <div className={classes.comments}>{repliesData.comments !== null && repliesData.comments.length > 0 ? repliesData.comments.map(commentData => <Reply commentId={props.commentID.comment.id} comment={commentData} author={repliesData.authors[commentData.authorIndex].author} key={commentData.id} />) : <p className={classes.noComments}>There are no replies.</p>}</div>}
  </>
}
export default Replies