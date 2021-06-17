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
import {useAuth} from './../../contexts/AuthContext'
import {db} from './../../firebase'
import firebase from 'firebase'
import ReplyItem from './ReplyItem'
export default function Comment(props) {
        const {currentUser} = useAuth();
        const[user, setUser] = useState(null);
        const[showReply, setShowReply] = useState(false);
        const[reply, setReply] = useState('');
        const[replies , setReplies] = useState(null);
       useState(()=>{
         getUser();
         GetReplies();
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

    async function GetReplies(){
      try{
         await db.collection(`posts/${props.postId}/comments/${props.commentId}/reply`).onSnapshot(snap=>{
           setReplies(snap.docs.map(data=>{return {id: data.id, data: data.data()}}))
       })
       } catch{
         console.log('something went wrong')
       }
     }

    async function handleReply(e){
        e.preventDefault();
        if(reply==''){
          return alert('reply can not be null');
        }
        try{
          await db.collection(`posts/${props.postId}/comments/${props.commentId}/reply`).add({
            user:currentUser.uid,
            comment: reply,
            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
          })
        }
        catch{
            console.log('somthing went wrong')
        }
        setShowReply(false);
        setReply('');
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
                      <text style={{fontSize:'14px',marginLeft:'5px',textDecorationLine:'underline',color:'blueviolet',cursor:'pointer'}}>{replies? replies.length : 0} Replies</text>
                    </div>
                    </div>
                    <div style={{paddingLeft:'10%',paddingRight:'10%', display:showReply? null: 'none'}}>
                    <form onSubmit={handleReply} style={{display:'flex',flexDirection:'row'}}>
                    <TextField
                        id="standard-textarea"
                        placeholder="Reply"
                        value={reply} onChange={(e)=>setReply(e.target.value)}
                        disabled = {currentUser ? false : true}
                        rowsMax={5}
                        multiline
                        fullWidth
                        />
                    <button type='submit' style={{backgroundColor:'transparent',border:'none'}}>
                         <SendIcon/>
                    </button>
                    </form>
                    </div>
                    <div style={{paddingLeft:'8%',marginTop:'10px'}}>
                     {replies?
                     <div>
                       {console.log('yse srldj')}
                       {replies.map(data=>{
                         return <ReplyItem data={data.data}/>
                       })}
                     </div>
                    :
                    null}
                    </div>
            <div>
            <hr/>
        </div>
    </div>
    }
</div>
  );    
}