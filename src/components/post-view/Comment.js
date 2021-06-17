import React, { useState } from 'react'
import {RiAccountCircleFill} from 'react-icons/ri'
import { Link } from 'react-router-dom'
import Default from '../../assets/default.jpg'
import {userdb} from './../../firebase'
// import GetProfile from './../../config/getProfile'
import {FaReply} from 'react-icons/fa'
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import {TextField} from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send';

export default function Comment(props) {
        const[user, setUser] = useState(null);
        const[showReply, setShowReply] = useState(false);
       useState(()=>{
         getUser()
       },[]);
    async function getUser(){
     try{
        await userdb.doc(props.data.user).onSnapshot(snap=>{
        setUser(snap.data());
      })
      } catch{
        console.log('something went wrong')
      }
    }
  return(
    <div className={'reply-box'}>
      {user==null? null
      :
    <div className={'reply'}>
                    <div className={'commenter-auther'} style={{display : 'flex'}}>
                        <div className={'commenter-icon'}>
                            <img src={user.profile_image==null ? Default : user.profile_image}/>
                        </div>
                        <div className="commenter-content" style={{border : '2px solid white',backgroundColor : '#e6e6e6',borderRadius : '10px',marginLeft : '10px',width : '80%',padding : '5px'}}>
                          {props.currentUser? 
                            <Link to={`/user/${props.data.user}`} style={{textDecorationLine:'none',display : 'block'}}>
                              <text>{user.username}</text>
                            </Link>
                            :
                            <div to={`/user/${props.data.user}`} style={{textDecorationLine:'none',display : 'block',color : 'blue'}}>
                              <text>{user.username}</text>
                            </div>
                            }
                          <text style={{fontSize:'15px',whiteSpace:'pre-wrap'}}>{props.data.comment}</text>
                        </div>
                    </div>
                    <div style={{display:'flex',flexDirection:'row',paddingTop:'5px',paddingLeft:'10%'}}>
                    <div className={'reply-button'}>
                      <ThumbUpAltIcon style={{marginRight:'3px',fontSize:'16px'}}/>Like
                      </div>
                    <div onClick={()=>setShowReply(true)} className={'reply-button'}>
                      <FaReply style={{marginRight:'3px'}}/>Reply
                      </div>
                    <div>
                      <text style={{fontSize:'14px',marginLeft:'5px',textDecorationLine:'underline',color:'blueviolet',cursor:'pointer'}}>0 Replies</text>
                    </div>
                    </div>
                    <div style={{paddingLeft:'10%',paddingRight:'10%', display:showReply? null: 'none'}}>
                    <form style={{display:'flex',flexDirection:'row'}}>
                    <TextField
                        id="standard-textarea"
                        placeholder="Reply"
                        // value={inputComment} onChange={(e)=>setInputComment(e.target.value)}
                        // disabled = {currentUser ? false : true}
                        rowsMax={5}
                        multiline
                        fullWidth
                        />
                    <button type='submit' style={{backgroundColor:'transparent',border:'none'}}>
                         <SendIcon/>
                    </button>
                    </form>
                    </div>
            <div>
            <hr/>
        </div>
    </div>
    }
</div>
  );    
}