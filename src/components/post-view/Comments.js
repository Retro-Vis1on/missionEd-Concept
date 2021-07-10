import { useCallback, useEffect, useReducer, useRef, useState } from "react"
import { useParams } from "react-router-dom";
import { getCommentsHandler, sendComment } from "../../apis/Post";
import classes from './Comments.module.css'
import ObjCpy from "../../helpers/ObjCpy";
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner";
import Comment from "./Comment";
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
  const comment = useRef()
  const [isLoading, loadingStateUpdater] = useState(false)
  const [isSubmit, submitStateUpdater] = useState(false)
  const [isValid, validStateUpdater] = useState(true)
  const postId = useParams().id
  const getComments = useCallback(() => {
    loadingStateUpdater(true)
    unsubscribe = getCommentsHandler(postId, commentsData, dispatcher, loadingStateUpdater.bind(this, false))
  }, [postId, commentsData])
  useEffect(() => {
    return () => {
      firstLoad = true
      if (unsubscribe)
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
    <form onSubmit={submitHandler} className={classes.commentForm}>
      <input type="text" name="comment" ref={comment} placeholder="Write a comment" className={`${classes.input} ${!isValid ? classes.invalid : ''}`} />
      <button disabled={isSubmit}><i className="fas fa-paper-plane"></i></button>
    </form>
    {isLoading || commentsData.commments === null ? <div style={{ textAlign: "center", padding: "35px 0" }}><LoadingSpinner /></div> : <div className={classes.comments}>{commentsData.comments !== null && commentsData.comments.length > 0 ? commentsData.comments.map(commentData => <Comment comment={commentData} author={commentsData.authors[commentData.authorIndex].author} key={commentData.id} />) : <p className={classes.noComments}>There are no comments</p>}</div>}
  </>
}
export default Comments