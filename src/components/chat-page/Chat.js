import { useCallback, useEffect, useReducer, useState } from "react"
import { Link } from "react-router-dom"
import { connectChat, createNewChat, sendMessage } from "../../apis/Chats"
import MessageBubble from "./MessageBubble"
import { auth } from "../../firebase"
import DefaultProfilePic from "../../helpers/DefaultProfilePic"
import ObjCpy from "../../helpers/ObjCpy"
import classes from './Chat.module.css'
import Alert from "../UI/Alert/Alert"
const initialState = {
    value: "",
    isValid: false,
    isSubmitted: false
}
const reducer = (state, action) => {
    const updateState = ObjCpy(state)
    if (action.type === "update") {
        updateState.value = action.value
        updateState.isValid = action.value.trim().length
    }
    else if (action.type === "submit")
        updateState.isSubmitted = true
    else if (action.type === "resetValid")
        updateState.isSubmitted = false
    else if (action.type === "reset") {
        return initialState
    }
    return updateState
}
let timer = null
const Chat = (props) => {
    const [error, errorStateUpdater] = useState(null)
    const [message, dispatch] = useReducer(reducer, { ...initialState })
    const [isSending, sendingStateUpdater] = useState(false)
    const activateListener = useCallback((id) => {
        connectChat(id, props.curChatUpdater)
    }, [props.curChatUpdater])
    const sendReply = async (event) => {
        try {
            sendingStateUpdater(true)
            event.preventDefault()
            dispatch({ type: "submit" })
            if (!message.isValid) {
                clearTimeout(timer)
                timer = setTimeout(() => dispatch({ type: "resetValid" }), 2000)
                return
            }
            let id = props.id
            if (id === -1) {
                id = await createNewChat(props.partner.id)
                props.curChatUpdater(prevState => ({ ...prevState, id }))
                activateListener(id)
            }
            sendMessage(id, message.value)
            document.getElementsByClassName(classes.form)[0].reset()
            dispatch({ type: "reset" })
        }
        catch (err) {
            errorStateUpdater("Something went wrong!")
        }
        finally {
            sendingStateUpdater(false)
        }
    }
    const inputChangeHandler = (e) => {
        dispatch({ type: "update", value: e.target.value })
    }
    useEffect(() => {
        if (props.id !== -1 && !props.unsub) {
            activateListener(props.id)
        }
    }, [props.id, props.unsub, activateListener])
    return <>
        <Alert error={error} onClose={errorStateUpdater.bind(this, null)} />
        {props.backToMenu && <button onClick={props.backToMenu} className={classes.backToMenu}><span>&lt;</span> Back to chats</button>}
        <div className={classes.messageWindow}>
            <div className={classes.partner}>
                <Link to={`/user/${props.partner.id}`}>
                    <img src={props.partner.userData.profile_image ? props.partner.userData.profile_image : DefaultProfilePic(props.partner.userData.username)} alt={props.partner.userData.username} />
                    <h2>{props.partner.userData.username}</h2>
                </Link>
            </div>

            <ul className={classes.messages}>
                {props.messages && props.messages.map((message, index) => <MessageBubble key={message.id} message={message.data.message} isUser={message.data.sender === auth.currentUser.uid} index={index} />)}
            </ul>
            <form className={classes.form} onSubmit={sendReply}>
                <input type="text" placeholder="Enter a message" className={`${message.isSubmitted && !message.isValid ? classes.invalid : ''}`} message={message.value ? message.value : ""} onChange={inputChangeHandler} disabled={isSending} />
                <button disabled={isSending}><i className="fas fa-paper-plane"></i></button>
            </form>
        </div></>
}
export default Chat