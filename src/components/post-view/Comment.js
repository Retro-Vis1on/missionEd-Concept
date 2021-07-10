import { Link } from "react-router-dom"
import timeDifference from "../../helpers/DateChange";
import Default from './../../assets/default.jpg'
import classes from './Comment.module.css'
const Comment = (props) => {
    const author = props.author;
    const authorLink = `/user/${props.comment.data.user}`
    const time = props.comment.data.timestamp ? timeDifference(new Date(props.comment.data.timestamp.seconds * 1000)) : null
    return <div className={classes.comment}>
        <div className={classes.userInfo}>
            <img src={author.profile_image ? author.profile_image : Default} alt={author.username} />
            <div>
                <Link to={authorLink}>
                    <p>{author.username}</p>
                </Link>
                <time>{time}</time>
            </div>

        </div>
        <p>{props.comment.data.comment}</p>
    </div>
}
export default Comment