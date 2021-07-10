import React, { useEffect, useState, useCallback } from 'react'
import './Messages.css'
import UserCard from './UserCard'
import { useAuth } from './../../contexts/AuthContext'
import { db } from './../../firebase'
import { Redirect } from 'react-router'
import Chats from './Chats'
import SearchIcon from '@material-ui/icons/Search';
export default function Messages() {
    const { currentUser } = useAuth();
    const [chatUsers, setChatUsers] = useState(null);
    const [chatMessages, setChatMessages] = useState(null);
    const [activeUser, setActiveUser] = useState(null);
    const [chatId, setChatId] = useState(null);
    const [ischatOpen, setChatOpen] = useState(false);

    const GetUsers = useCallback(async () => {
        if (currentUser) {
            db.collection('chats').where('users', 'array-contains-any', [currentUser.uid]).onSnapshot(snap => {
                setChatUsers(snap.docs.map(data => { return { id: data.id, data: data.data() } }));
            })
        }

    }, [currentUser])
    useEffect(() => {
        GetUsers();
    }, [GetUsers])
    async function SetChatBox(data) {
        let id = currentUser.uid === data.data.users[0] ? data.data.users[1] : data.data.users[0];
        setActiveUser(id);
        ChatMessages(data.id)
    }
    async function ChatMessages(chatId) {
        setChatId(chatId)
        try {
            db.collection(`chats/${chatId}/messages`).orderBy('timestamp', 'asc').onSnapshot(snap => {
                setChatMessages(snap.docs.map(data => data.data()));
            })
        } catch {
            console.log('something went wrong')
        }
        setChatOpen(true)
    }
    const handleLeftMenu = () => {
        setChatOpen(!ischatOpen)
    }

    return (
        <div className='message-page'>
            {currentUser == null && <Redirect to='./welcome' />}
            <div className='message-card'>
                <div className={!ischatOpen ? 'chat-users-section' : 'chat-users-section chat-users-section-close'}>
                    <div className='chat-user-heading'>

                        <SearchIcon style={{ fontSize: '32px', color: 'black' }} />
                        <input placeholder={'Search'} />
                    </div>
                    <div className='chat-usercards' style={{ backgroundColor: 'white' }}>
                        {chatUsers == null ?
                            <div className='loading-box'>
                                <div className='loader'></div>
                            </div>
                            :
                            <div>
                                {currentUser ? chatUsers.map(data => {
                                    let id = currentUser.uid === data.data.users[0] ? data.data.users[1] : data.data.users[0];
                                    return (
                                        <div style={{ backgroundColor: activeUser === id ? 'rgba(0,0,0,0.08)' : null }} onClick={() => SetChatBox(data)}>
                                            <UserCard data={data.data} />
                                        </div>
                                    );
                                }) : null}
                            </div>}
                    </div>
                </div>
                <div className={ischatOpen ? 'message-section' : 'message-section message-section-mobile'}>
                    {chatMessages == null ?
                        <div></div>
                        :
                        <Chats chatMessages={chatMessages} chatId={chatId} id={activeUser} actions={() => handleLeftMenu()} />
                    }
                </div>
            </div>
        </div>
    )
}
