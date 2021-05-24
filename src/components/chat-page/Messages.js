import React from 'react'
import './Messages.css'
import UserCard from './UserCard'
import Default from './../../assets/default.jpg'
import SendIcon from '@material-ui/icons/Send';
import {Button} from '@material-ui/core'
import {Form} from 'react-bootstrap'
export default function Messages() {


    const Message = (props) =>{
        if(props.sender)
        return(
            <div className='sender-message'>
               <text>{props.text}</text>
            </div>
        )
        return(
            <div className='receiver-message'>
                <text>{props.text}</text>
            </div>
        )
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
                     
                     <div className={'chat-box'}>
                            <Message sender={true} text={'hi bahi'}/>
                            <Message sender={false} text={'hello brother'}/>
                            <Message sender={false} text={'or bta kaisa h'}/>
                     </div>
                
                    </Form>
                  </div>
              </div>
        </div>
    )
}
