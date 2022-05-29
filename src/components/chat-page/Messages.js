import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { getUsers } from "../../apis/Chats"
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner"
import User from "./User"
import Chat from "./Chat"
import classes from './Messages.module.css'
import ObjCpy from "../../helpers/ObjCpy"
import useWindowDimensions from '../../hooks/useWindowDimensions'
let messages = []
const Messages = (props) => {
    const [chats, chatsUpdater] = useState(null)
    const [curChat, curChatUpdater] = useState(null)
    const { width } = useWindowDimensions()
    const cachedAuthors = useSelector(state => state.cache).authorData
    const messagesAllocator = (data) => { messages = ObjCpy(data) }
    const GetUsers = useCallback(() => {
        let newPartner = null
        if (props.location.state && props.location.state.partner)
            newPartner = props.location.state.partner
        getUsers(chatsUpdater, cachedAuthors, messagesAllocator, messages, newPartner)
        if (newPartner)
            curChatUpdater({ id: -1, partner: props.location.state.partner })
    }, [cachedAuthors, props.location.state])
    const updateCache = (updatedChat) => {
        const indi = messages.findIndex(message => message.id === updatedChat.id)
        if (indi === -1)
            messages.push(updatedChat)
        else
            messages[indi] = updatedChat
    }
    const onConnect = (id, unsub) => {
        let prevState = ObjCpy(messages)
        const indi = prevState.findIndex(message => message.id === id)
        prevState[indi].unsub = unsub
        messages = ObjCpy(messages)
    }
    const changeChatHandler = (newId) => {
        if (curChat)
            updateCache(curChat)
        curChatUpdater(messages.find(message => message.id === newId))
    }
    useEffect(() => {
        GetUsers()
    }, [GetUsers])
    if (chats === null)
        return <div style={{ textAlign: "center" }}><LoadingSpinner /></div>
    if (width > 670)
        return <div className={classes.chatWindow}>
            <div className={classes.chatsDiv}>
                <h2>Chats</h2>
                <ul className={classes.chats}>
                    {chats.map(chat => <User key={chat.id} {...chat} onClick={changeChatHandler.bind(this, chat.id)} isActive={curChat && chat.id === curChat.id} />)}
                </ul>
            </div>
            {
                curChat ? <Chat {...curChat} curChatUpdater={curChatUpdater} updateCache={updateCache} onConnect={onConnect} /> : null
            }
        </div>
    return !curChat ? <div className={classes.chatsDiv}>
        <h2>Chats</h2>
        <ul className={classes.chats}>
            {chats.map(chat => <User key={chat.id} {...chat} onClick={changeChatHandler.bind(this, chat.id)} isActive={curChat && chat.id === curChat.id} />)}
        </ul>
    </div > : <Chat {...curChat} curChatUpdater={curChatUpdater} updateCache={updateCache} onConnect={onConnect} backToMenu={changeChatHandler.bind(this, null)} />

}
export default Messages