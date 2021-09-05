import { useState } from 'react'
import { Link, useParams } from "react-router-dom"
import { auth } from '../../../../firebase'
import { deleteReply, ReplyLikeUpdater } from '../../../../apis/Post'
import timeDifference from "../../../../helpers/DateChange";
import classes from '../Comment.module.css'
import Alert from '../../../UI/Alert/Alert';
import LikeModal from '../../PostActions/LikeModal';
import DefaultProfilePic from '../../../../helpers/DefaultProfilePic';
import ReactGa from 'react-ga'
import DeleteModal from '../../PostActions/DeleteModal';
const Reply = (props) => {
    const [error, errorStateUpdater] = useState(null)
    const [isOpenLike, likeModalStateUpdater] = useState(false)
    const [isDelete, deleteStateUpdater] = useState(false)
    const postId = useParams().id
    const author = props.author;
    const authorLink = `/user/${props.comment.data.user}`
    const updateReplyLike = async () => {
        let likeArr = [...props.comment.data.liked]
        if (!props.comment.isLiked)
            likeArr.push(auth.currentUser.uid)
        else
            likeArr.splice(likeArr.indexOf(auth.currentUser.uid), 1)
        try {
            await ReplyLikeUpdater(postId, props.commentId, props.comment.id, likeArr)
        }
        catch (err) {
            errorStateUpdater(err.message)
        }
    }
    const deleteHandler = async (event) => {
        event.preventDefault();

        try {
            deleteStateUpdater(true)
            await deleteReply(props.postId, props.commentId, props.comment.id);
            ReactGa.event({
                category: 'Post',
                action: 'Deleted Post Reply',
                value: {
                    uid: auth.currentUser.uid,
                    postId
                }
            })
        }
        catch (err) {
            errorStateUpdater("Sorry! Something went wrong on our end.")
        }
        finally {
            deleteStateUpdater(false)
        }

    }
    const time = props.comment.data.timestamp ? timeDifference(new Date(props.comment.data.timestamp.seconds * 1000)) : null
    return <>
        <LikeModal likes={props.comment.data.liked} isOpen={isOpenLike} onClose={likeModalStateUpdater.bind(this, false)} />
        <DeleteModal type="reply" deleteHandler={deleteHandler} onClose={deleteStateUpdater.bind(this, false)} open={isDelete} />
        <Alert error={error} onClose={errorStateUpdater.bind(this, null)} />
        <div className={classes.comment}>
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

                <div className={classes.likes}>
                    <button className={classes.likeCount} onClick={likeModalStateUpdater.bind(this, true)}>{parseInt(props.comment.data.liked.length / 1000) ? `${(props.comment.data.liked.length / 1000).toFixed(1)}k` : props.comment.data.liked.length} {props.comment.data.liked.length === 1 ? 'like' : 'likes'}</button>
                    <button className={`${classes.btn} ${props.comment.isLiked ? classes.active : ''}`} onClick={updateReplyLike}><i className='fas fa-thumbs-up'></i> Like</button>
                    {auth.currentUser.uid === props.comment.data.user ? <button className={`${classes.delete}`} onClick={deleteStateUpdater.bind(this, true)} disabled={isDelete}><i className='fas fa-trash'></i> Delete </button> : ''}
                </div>
            </div>
        </div>
    </>
}

export default Reply
