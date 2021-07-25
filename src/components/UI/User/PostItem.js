import { Link } from "react-router-dom"
import PostType from "../PostType/PostType"
import classes from './PostItem.module.css'
const PostItem = (props) => {
    return <li className={classes.post}>
        <Link to={`/post/${props.id}`}>
            <h4>{props.post.title}</h4>
        </Link>
        <PostType tag={props.post.tag} />
    </li>
}
export default PostItem