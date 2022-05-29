import classes from './MessageBubble.module.css'
const MessageBubble = (props) => {
    return <li className={`${classes.bubble} ${props.isUser ? classes.user : classes.partner}`} >
        {props.message}
    </li>
}
export default MessageBubble