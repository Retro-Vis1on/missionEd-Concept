import React from 'react'
import './Messages.css'
import UserCard from './UserCard'
import Default from './../../assets/default.jpg'
import SendIcon from '@material-ui/icons/Send';
import {Button} from '@material-ui/core'
export default function Messages() {
    return (
        <div className='message-page'>
              <div className='message-card'>
                  <div className={'chat-users-section'}>
                      <div className='chat-user-heading'>
                        <img src={Default}/>
                        <input placeholder='search'/>
                      </div>
                      <div className='chat-usercards'>
                      <UserCard/>
                      <UserCard/>
                      <UserCard/>
                      <UserCard/>
                      <UserCard/>
                      <UserCard/>
                      <UserCard/>
                      <UserCard/>
                      <UserCard/>
                      <UserCard/>
                      <UserCard/>
                      </div>
                  </div>
                  <div className={'message-section'}>
                     <div className='message-section-heading'>
                         <img src={Default}/>
                         <text>Amar Preet Singh</text>
                     </div>
                     <div className='message-section-chat-input'>
                         <input placeholder=' message:)'/>
                         <Button
                              variant="contained"
                              color="primary"
                              endIcon={<SendIcon/>}
                           >
                            Send
                           </Button>
                     </div>
                  </div>
              </div>
        </div>
    )
}
