import React,{useEffect, useState,useRef} from 'react'
import './Messages.css'
import UserCard from './UserCard'
import {useAuth} from './../../contexts/AuthContext'
import {userdb,db} from './../../firebase'
import { Redirect } from 'react-router'
import Chats from './Chats'
import SearchIcon from '@material-ui/icons/Search';
export default function Messages() {
    const{currentUser} = useAuth();
    const[chatUsers,setChatUsers] = useState(null);
    const[chatMessages, setChatMessages] = useState(null);
    const messageInputRef = useRef();
    const[activeUser,setActiveUser] = useState(null);
    const[chatId, setChatId] = useState(null);
  
    useEffect(()=>{
         GetUsers();
    },[])

    async function GetUsers(){
        await db.collection('chats').where('users','array-contains-any',[currentUser.uid]).onSnapshot(snap=>{
            snap.docs.map(data=>{console.log(data.id)})
            setChatUsers(snap.docs.map(data=>data.data()));
        })
    }

    async function SetChatBox(data){
        let id = currentUser.uid === data.users[0] ? data.users[1] : data.users[0];
        setActiveUser(id);
        try{
            await db.collection('chats').where('users','array-contains-any',[currentUser.uid]).onSnapshot(snap=>{
                snap.docs.map(data=>{
                    if(data.data().users.includes(id))
                    {
                        ChatMessages(data.id);
                    }
                })
            })
        } catch{
            alert('something went wrong')
        }
    }
    async function ChatMessages(chatId){
        setChatId(chatId)
        try{
            await db.collection(`chats/${chatId}/messages`).orderBy('timestamp', 'asc').onSnapshot(snap=>{
               setChatMessages(snap.docs.map(data=>data.data()));
            })
        } catch{
            console.log('something went wrong')
        }
      }
    
    return (
        <div className='message-page'>
            {currentUser==null && <Redirect to='./welcome'/>}
              <div className='message-card'>
                  <div className={'chat-users-section'}>
                      <div className='chat-user-heading'>
                        <SearchIcon style={{fontSize:'32px',color:'white'}}/>
                        <input placeholder={'Search'}/>
                      </div>
                      <div className='chat-usercards'>
                    {chatUsers==null?
                            <div className='loading-box'>
                                 <div className='loader'></div>
                            </div>
                            :
                            <div>
                                {chatUsers.map(data=>{
                                     let id = currentUser.uid === data.users[0] ? data.users[1] : data.users[0];
                                    return (
                                        <div style={{backgroundColor:activeUser==id ? 'rgba(0,0,0,0.08)':null}} onClick={()=>SetChatBox(data)}>
                                            <UserCard data={data}/>
                                        </div>
                                    );
                                })}
                            </div> }
                      </div>
                  </div>
                  <div className={'message-section'}>
                     {/* <div className='message-section-heading'>
                         <img src={Default}/>
                         <text>Amar Preet Singh</text>
                     </div>
                     <Form onSubmit={(e)=>SendMessage(e)}>
                     <div className='message-section-chat-input'>
                         <input placeholder=' message:)' ref={messageInputRef}/>
                         <Button
                             type='submit'
                              variant="contained"
                              color="primary"
                              endIcon={<SendIcon/>}
                              >
                            Send
                           </Button>
                     </div>
                     </Form>
                     {chatMessages==null?
                         <div><text>hey click on user and chat</text></div>
                         :
                         <div className='chat-box'>
                             {chatMessages.map(data=>{
                                 return <CreateMessage data={data}/>
                             })}
                         </div> 
                    }
                    
                */}
                  {chatMessages==null ?
                  <div></div>
                  :
                  <Chats chatMessages={chatMessages} chatId={chatId} id={activeUser} />
                  }
                  </div> 
              </div>
        </div>
    )
}
