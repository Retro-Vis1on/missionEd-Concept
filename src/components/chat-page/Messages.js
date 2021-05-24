import React,{useEffect, useState} from 'react'
import './Messages.css'
import UserCard from './UserCard'
import {useAuth} from './../../contexts/AuthContext'
import Default from './../../assets/default.jpg'
import SendIcon from '@material-ui/icons/Send';
import {Button} from '@material-ui/core'
import {Form} from 'react-bootstrap'
import {userdb,db} from './../../firebase'

export default function Messages() {
    const{currentUser} = useAuth();
    const[chatUsers,setChatUsers] = useState(null);
    const[chatMessages, setChatMessages] = useState(null);
    const CreateMessage = (props) =>{
        if(props.data.sender===currentUser.uid)
        return(
            <div className='sender-message'>
               <text>{props.data.message}</text>
            </div>
        )
        return(
            <div className='receiver-message'>
                <text>{props.data.message}</text>
            </div>
        )
    }
    useEffect(()=>{
         GetUsers();
    },[])

    async function GetUsers(){
        await db.collection('chats').where('users','array-contains-any',[currentUser.uid]).onSnapshot(snap=>{
            snap.docs.map(data=>{console.log(data.id)})
            setChatUsers(snap.docs.map(data=>data.data()));
        })
    }

    const [Chat, setChat] = useState(null);
    async function SetChatBox(data){
        console.log(data)
        let id = currentUser.id === data.users[0] ? data.users[1] : data.users[0];
        console.log(id)
        
        try{
            await db.collection('chats').where('users','array-contains-any',[id,currentUser.uid]).onSnapshot(snap=>{
                snap.docs.map(data=>{ChatMessages(data.id)})
            })
        } catch{
            alert('something went wrong')
        }
    }
    async function ChatMessages(chatId){
        try{
            await db.collection(`chats/${chatId}/messages`).onSnapshot(snap=>{
               setChatMessages(snap.docs.map(data=>data.data()));
            })
        } catch{
            console.log('something went wrong')
        }
      }
    
    return (
        <div className='message-page'>
              <div className='message-card'>
                  <div className={'chat-users-section'}>
                      <div className='chat-user-heading'>
                        <img src={Default}/>
                        <input placeholder='search'/>
                      </div>
                      <div className='chat-usercards'>
                    {chatUsers==null?
                            <div className='loading-box'>
                                 <div className='loader'></div>
                            </div>
                            :
                            <div>
                                {chatUsers.map(data=>{
                                    console.log(data);
                                    return (
                                        <div onClick={()=>SetChatBox(data)}>
                                            <UserCard data={data}/>
                                        </div>
                                    );
                                })}
                            </div> }
                      {/* <div>
                      <UserCard/>
                      </div>
                      <UserCard/>
                      <UserCard/>
                      <UserCard/>
                      <UserCard/>
                      <UserCard/>
                      <UserCard/>
                      <UserCard/>
                      <UserCard/>
                      <UserCard/>
                      <UserCard/> */}
                      </div>
                  </div>
                  <div className={'message-section'}>
                     <div className='message-section-heading'>
                         <img src={Default}/>
                         <text>Amar Preet Singh</text>
                     </div>
                     <Form>

                     <div className='message-section-chat-input'>
                         <input placeholder=' message:)'/>
                         <Button
                             type='submit'
                              variant="contained"
                              color="primary"
                              endIcon={<SendIcon/>}
                              >
                            Send
                           </Button>
                     </div>
                     {chatMessages==null?
                         <div><text>hey click on user and chat</text></div>
                         :
                         <div className='chat-box'>
                             {chatMessages.map(data=>{
                                 return <CreateMessage data={data}/>
                             })}
                         </div> 
                    }
                     {/* <div className={'chat-box'}>
                         
                            <Message sender={true} text={'hi bahi'}/>
                            <Message sender={false} text={'hello brother'}/>
                            <Message sender={false} text={'or bta kaisa h'}/>
                     </div> */}
                
                    </Form>
                  </div>
              </div>
        </div>
    )
}
