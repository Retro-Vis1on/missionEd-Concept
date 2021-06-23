import React, { useEffect, useState } from 'react'
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
import Modal from 'react-modal'
import LikeProfile from './LikeProfile'
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

export default function Comment(props) {
        const {currentUser} = useAuth();
        const[user, setUser] = useState(null);
        const[showReply, setShowReply] = useState(false);
        const[reply, setReply] = useState('');
        const[replies , setReplies] = useState(null);
        const[showReplies, setShowReplies] = useState(false);
        const[isLiked, setLike] = useState(false)
        const[allLiked, setAllLiked] = useState(null)
        const[likeModal, setLikeModal] = useState(false);
       useEffect(()=>{
         getUser();
         GetReplies();
         SetLiked();
       },[props.commentId]);
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

    
    async function SetLiked(){
      try{
        db.collection(`posts/${props.postId}/comments`).doc(props.commentId).onSnapshot(snap=>{
        if(snap.exists){ 
          setAllLiked(snap.data().liked);
          if(snap.data().liked){
            if(!snap.data().liked.length){
              console.log('salaksjdflkjasdlk')
              setLike(false)
            }
            else{
              if(currentUser){
                console.log(snap.data().liked.includes(currentUser.uid))
                setLike(snap.data().liked.includes(currentUser.uid));
              }
            }
          }
          else{
            db.collection(`posts/${props.postId}/comments`).doc(props.commentId).update({
              liked:[],
            })
          }
        }
        })

      } catch{
        console.log('error in getting saved')
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
        setShowReplies(true);
    }

    const replyClick = ()=>{
      setShowReplies(!showReplies);
    }

    async function likeClick(){
      if(isLiked){
        let index = allLiked.indexOf(currentUser.uid)
         setAllLiked(allLiked.splice(index,1));
        try{
           await  db.collection(`posts/${props.postId}/comments`).doc(props.commentId).update({
               liked: allLiked
           })
           setLike(false);
        }catch{
            console.log('something went wrong')
        }
    }
    else{
        setAllLiked(allLiked.push(currentUser.uid))
        try{
            await  db.collection(`posts/${props.postId}/comments`).doc(props.commentId).update({
                liked:allLiked,
            })
            setLike(true);
        }
        catch{
            console.log('something went wrong!')
        }
        // if(topic.user!= currentUser.uid){
        //   NotificationForLike(currentUser.uid, topic.user)
        // }
    }
    }
  
    const onCancelLikeModal =()=>{
      setLikeModal(false);
    }


  return(
    <div className={'reply-box'}>
      {user==null? null
      :
    <div className={'reply'}>
                    <div className={'commenter-auther'} style={{display : 'flex'}}>
                        <div className={'commenter-icon'}>
                            <img src={user.profile_image==null ? Default : user.profile_image=='' ? Default : user.profile_image}/>
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
                      <text onClick={()=>setLikeModal(true)} style={{color:'blueviolet',cursor:'pointer'}}>{allLiked? allLiked.length : 0}</text>
                    {isLiked ?
                       <div className={'reply-button'} onClick={()=>{if(currentUser) return likeClick()}}>
                      <ThumbUpAltIcon style={{marginRight:'3px',fontSize:'16px'}}/>Liked
                      </div>
                      :
                      <div className={'reply-button'} onClick={()=>{if(currentUser) return likeClick()}} >
                      <ThumbUpAltOutlinedIcon style={{marginRight:'3px',fontSize:'16px'}}/>Like
                      </div>
                    }
                    <div onClick={()=>setShowReply(true)} className={'reply-button'}>
                      <FaReply style={{marginRight:'3px'}}/>Reply
                      </div>
                    <div onClick={()=>replyClick()}>
                      <text style={{fontSize:'14px',marginLeft:'5px',textDecorationLine:'underline',color:'blueviolet',cursor:'pointer'}}>{replies? replies.length : 0} Replies</text>
                    </div>
                    </div>
                    <div style={{paddingLeft:'10%',paddingRight:'10%', display:showReply? null: 'none',paddingBlock:'10px'}}>
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
                     {replies && showReplies ?
                     <div>
                       {replies.map(data=>{
                         return <ReplyItem data={data.data} postId={props.postId} commentId={props.commentId} replyId={data.id}/>
                       })}
                     </div>
                    :
                    null}
                    </div>
            <div>
            <hr/>
        </div>
        <Modal isOpen={likeModal} onRequestClose={()=>onCancelLikeModal()} 
                           style={{
                            content : {
                                borderRadius: '20px',
                                top                   : '50%',
                                left                  : '50%',
                                right                 : 'auto',
                                bottom                : 'auto',
                                marginRight           : '-50%',
                                transform             : 'translate(-50%, -50%)',
                                backgroundColor:  'white',
                              },
                          }}>
                    <div className='like-modal'>
                      <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',borderBottom:'solid 1px',marginBottom:'5px'}}>
                      <text style={{fontSize:'18px',fontWeight:'bold',alignSelf:'center'}}>Likes</text>
                      <IconButton onClick={()=>onCancelLikeModal()}>
                        <ClearIcon/>
                      </IconButton>
                      </div>
                        {allLiked && allLiked.length ? 
                           <div style={{maxHeight:'450px',overflow:'scroll',overflowX:'hidden'}}>
                           {allLiked.map(data=>{
                            return <LikeProfile id={data}/>
                           })}
                           </div>
                        :
                         <div style={{textAlign:'center',paddingBlock:"20px"}}>
                           No likes yet!
                          </div>
                     }
                    </div>
            </Modal>
    </div>
    }
</div>
  );    
}