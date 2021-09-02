import { useState } from "react";
import { Link, useParams } from "react-router-dom"
import { CommentLikeUpdater } from "../../../apis/Post";
import { deleteComment } from "../../../apis/Post";
import { auth } from "../../../firebase";
import timeDifference from "../../../helpers/DateChange";
import DefaultProfilePic from "../../../helpers/DefaultProfilePic";
import Alert from "../../UI/Alert/Alert";
import classes from './Comment.module.css'
import LikeModal from "../PostActions/LikeModal";
import Replies from './Replies/Replies'
const Comment = (props) => {
    const [openReplies, replyStateUpdater] = useState(false)
    const [error, errorStateUpdater] = useState(null)
    const [isSubmit, submitStateUpdater] = useState(false)
    const [isOpenLike, likeModalStateUpdater] = useState(false)
    const author = props.author;
    const authorLink = `/user/${props.comment.data.user}`
    const postId = useParams().id
    const time = props.comment.data.timestamp ? timeDifference(new Date(props.comment.data.timestamp.seconds * 1000)) : null
    const updateLike = async () => {
        let likeArr = [...props.comment.data.liked]
        if (!props.comment.isLiked)
            likeArr.push(auth.currentUser.uid)
        else
            likeArr.splice(likeArr.indexOf(auth.currentUser.uid), 1)
        try {
            await CommentLikeUpdater(postId, props.comment.id, likeArr)
        }
        catch (err) {
            errorStateUpdater(err.message)
            console.log(err)
        }
    }
    const deleteHandler = async (event) => {
        event.preventDefault();
        
        try {
          submitStateUpdater(true)
          await deleteComment(props.postId,props.comment.id);
          
        }
        catch (err) {
          errorStateUpdater("Sorry! Something went wrong on our end.")
        }
        finally {
          submitStateUpdater(false)
        }
    
      }

    return <>
        <LikeModal likes={props.comment.data.liked} isOpen={isOpenLike} onClose={likeModalStateUpdater.bind(this, false)} />
        <Alert error={error} onClose={errorStateUpdater.bind(this, null)} />
        <li className={classes.comment}>
            <div className={classes.userInfo}>
                <img src={author.profile_image ? author.profile_image : DefaultProfilePic(author.username)} alt={author.username} />
                <div>
                    <Link to={
                        {
                            pathname: authorLink,
                            state: {
                                user: author.isDeleted ? null : author
                            }
                        }
                    }>
                        <p>{author.username}</p>
                    </Link>
                    <time>{time}</time>
                </div>
            </div>
            <p>{props.comment.data.comment}</p>
            <div className={classes.commentActions}>
                <button className={classes.likeCount} onClick={likeModalStateUpdater.bind(this, true)}>{parseInt(props.comment.data.liked.length / 1000) ? `${(props.comment.data.liked.length / 1000).toFixed(1)}k` : props.comment.data.liked.length} {props.comment.data.liked.length === 1 ? 'like' : 'likes'}</button>
                <div className={classes.likes}>
                    <button className={`${classes.btn} ${props.comment.isLiked ? classes.active : ''}`} onClick={updateLike} ><i className='fas fa-thumbs-up'></i> Like</button>
                    <button className={`${classes.btn} ${openReplies ? classes.active : ''}`} onClick={() => replyStateUpdater(prevState => !prevState)}><i className='fas fa-comments'></i> View Replies</button>
                    {auth.currentUser.uid===props.comment.data.user?<div className={classes.delete} onClick={deleteHandler}><i className='fas fa-trash'></i> Delete </div>:''}
                </div>
            </div>
            <Replies commentID={props} isOpen={openReplies} />
        </li>
    </>
}
export default Comment