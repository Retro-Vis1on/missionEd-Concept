import React, { useState,useEffect,useRef} from 'react'
import Default from './../../assets/default.jpg'
import SendIcon from '@material-ui/icons/Send';
import {Button} from '@material-ui/core'
import {Form} from 'react-bootstrap'
import {userdb,db} from './../../firebase'
import {useAuth} from './../../contexts/AuthContext'
import firebase from 'firebase'
export default function Chats(props) {
    const[user, setUser] = useState(null);
    const{currentUser} = useAuth();
    const messageInputRef = useRef();
    const[input, setInput] = useState('');
    useEffect(()=>{
        GetUser()
        setInput('')
    },[props.id])

    async function GetUser(){
        console.log(props.id)
        try{
         await userdb.doc(props.id).onSnapshot(snap=>{
            setUser(snap.data())
          })
        }catch{
            alert('something went wrong!')
        }
    }


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
    
    async function SendMessage(e){
        e.preventDefault();
        if(input !== ''){
            if(props.chatId!==null){
                try{
                    db.collection(`chats/${props.chatId}/messages`).add({
                        message:input,
                        sender:currentUser.uid,
                        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                      })
                  }catch{
                      console.log('something went wrong!!')
                  }
              }
          }
          setInput('');
      }


    return (
         <div className='message-chat-box'>
            <div className='message-section-heading'>
                     {user==null?
                         <div></div>
                       :
                       <div>
                         <img src={Default}/>
                         <text>{user.name}</text>
                       </div>
                     }
                     
                     </div>
                         {props.chatMessages==null ?
                             <div className='chat-box'><text>{props.chatId}</text></div>
                             :
                             <div className='chat-box' id="scroll">
                                 {props.chatMessages.map(data=>{
                                     return <CreateMessage data={data}/>
                                 })}
                             </div> 
                        }
                     <Form onSubmit={(e)=>SendMessage(e)}>
                     <div className='message-section-chat-input'>
                         <input placeholder=' message:)' value={input} onChange = {(e)=>{setInput(e.target.value)}} />
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
                    
        </div>
    )
}
