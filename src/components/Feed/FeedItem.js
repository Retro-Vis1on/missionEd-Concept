import timeDifference from '../../helpers/DateChange'
import classes from './FeedItem.module.css'
import { Link } from 'react-router-dom'
import PostType from '../UI/PostType/PostType'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import DefaultProfilePic from '../../helpers/DefaultProfilePic'
const FeedItem = (props) => {
    const { width } = useWindowDimensions()
    const post = props.postData.post
    const author = props.authorData.author
    const postLink = `/post/${props.postData.id}`
    const authorLink = `/user/${props.authorData.id}`
    let time = timeDifference(new Date(post.timestamp))
    if (width > 670)
        return <li className={classes.post}>
            <Link to={postLink}>
                <h2>{post.title}</h2>
            </Link>
            <time>{time}</time>
            <Link to={authorLink}>
                <div className={classes.profile}>
                    <img src={author.profile_image ? author.profile_image : DefaultProfilePic(author.username)} alt={author.username} />
                    <p>{author.username}</p>
                </div>
            </Link>
            <PostType tag={post.tag} />
            <div>
                <p style={{ textAlign: "end" }}>{parseInt(post.liked.length / 1000) ? `${(post.liked.length / 1000).toFixed(1)}k` : post.liked.length} {post.liked.length === 1 ? 'like' : 'likes'}</p>
            </div>
        </li>
    return <li className={classes.post}>
        <Link to={postLink}>
            <h2>{post.title}</h2>
        </Link>


        <div className={classes.mobileView}>

            <Link to={authorLink}>
                <div className={classes.profile}>
                    <img src={author.profile_image ? author.profile_image : DefaultProfilePic(author.username)} alt={author.username} />
                    <p>{author.username}</p>
                </div>
            </Link>
            <div className={classes.postInfo}>
                <PostType tag={post.tag} />
                <div className={classes.likeTime}>
                    <time>{time}</time>
                    <p>{parseInt(post.liked.length / 1000) ? `${(post.liked.length / 1000).toFixed(1)}k` : post.liked.length} {post.liked.length === 1 ? 'like' : 'likes'}</p>
                </div>
            </div>
        </div>
    </li>

}
export default FeedItem