import { useState } from "react"
import timeDifference from "../../helpers/DateChange"
import Button from "../UI/Button/Button"
import classes from './Notification.module.css'
import LoadingSpinner from '../UI/LoadingSpinner/LoadingSpinner'
import { deleteNotification } from "../../apis/User"
import DefaultProfilePic from "../../helpers/DefaultProfilePic"
import { Link } from "react-router-dom"
const NotificationItem = (props) => {
    const [isLoading, loadingStateUpdater] = useState(false)
    const deleteHandler = async () => {
        try {
            loadingStateUpdater(true)
            await deleteNotification(props.id)
        }
        catch (err) {
            console.log(err)
            loadingStateUpdater(false)
        }
    }
    const time = timeDifference(new Date(props.data.timestamp))
    let message = <h3 className={classes.message}>{props.data.msg}</h3>

    if (props.data.follower) {
        message =
            <h3 className={classes.message}>
                <Link
                    to={
                        {
                            pathname: `/user/${props.data.follower.uid}`,
                            state: {
                                user: props.data.follower.isDeleted ? null : props.data.follower
                            }
                        }
                    }>
                    <img src={props.data.follower.user.profile_image ? props.data.follower.user.profile_image : DefaultProfilePic(props.data.follower.user.username)} alt={props.data.follower.user.username} />
                </Link>
                < span >
                    <Link to={{
                        pathname: `/user/${props.data.follower.uid}`,
                        state: {
                            user: props.data.follower.isDeleted ? null : props.data.follower
                        }
                    }}>{props.data.follower.user.username}</Link> {props.data.postId ? <> liked your <Link to={`/post/${props.data.postId}`}>post</Link></> : props.data.msg}
                </span>
            </h3>
    }
    return < li className={`${classes.notification} ${!props.data.seen ? classes.new : ''}`
    }>
        <div className={classes.content}>
            <div>
                {message}
            </div>
            <time>{time}</time>
        </div>
        {
            isLoading ? <LoadingSpinner /> :
                <Button onClick={deleteHandler}>Delete Notification</Button>
        }
    </li >
}
export default NotificationItem