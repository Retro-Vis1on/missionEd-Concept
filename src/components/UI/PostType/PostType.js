import classes from './PostType.module.css'
const PostType = (props) => {
    return <div className={`${classes.tag} ${classes[props.tag]}`}>
        <p >{props.tag}</p>
    </div>
}
export default PostType