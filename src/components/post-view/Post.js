import react, { useState, useEffect, useRef} from 'react'
import './Post.css'
import Comment from './Comment'
import {RiAccountCircleFill} from 'react-icons/ri'
import Default from './../../assets/default.jpg'
import {AiOutlineSave,AiFillSave} from 'react-icons/ai'
import SendIcon from '@material-ui/icons/Send';
import {Button} from '@material-ui/core'
import {db,userdb} from './../../firebase'
import {Form} from 'react-bootstrap'
import {useAuth} from './../../contexts/AuthContext'
import firebase from 'firebase'
import {TextField} from '@material-ui/core'
import {Link} from 'react-router-dom'
import EditPost from './EditPost';
import DeletePost from './DeletePost'
import Linkify from 'react-linkify';
import React from 'react'
import {UpdateCoins} from './../../apis/API'
import parse from 'html-react-parser';
import { Redirect } from 'react-router'
import { UpdateNotificationForCoins } from '../../apis/NotificationApi'
export default function Topic(props) {
    const {currentUser} = useAuth()
    const[loading,setLoading] = useState(true)
    const[topic, setTopic] = useState(null);
    const[topicComment, setTopicComment] = useState(null);
    const[user,setUser] = useState(null);
    const[isSaved, setSave] = useState(false)
    const[allSaved, setAllSaved] = useState(null)
    const[postId, setPostId] = useState(null)
    const[inputComment, setInputComment] = useState('');
    const[load,setLoad] = useState(false);
    const commentRef = useRef();
    useEffect(()=>{
      const path = window.location.pathname;
      const id = path.substring(path.lastIndexOf('/')+1);
      setPostId(id);
      getTopicData(id);
      SetSaved(id);
    },[])
    async function SetSaved(id){
      try{
        db.collection('users').doc(currentUser.uid).onSnapshot(snap=>{
          setAllSaved(snap.data().saved);
          if(snap.data().saved){
            setSave(snap.data().saved.includes(id));
          }
          else{
            db.collection('users').doc(currentUser.uid).update({
              saved:[],
            })
          }
        })
      } catch{
        console.log('error in getting saved')
      }
    }

    async function getTopicData(id){
      try{
        await db.collection('posts').doc(id).onSnapshot(snap=>{
          if(snap.data()){
            setTopic(snap.data())
            userdb.doc(snap.data().user).onSnapshot(snap=>{
              setUser(snap.data())
            })
          }
        });
        await db.collection(`posts/${id}/comments`).orderBy('timestamp','desc').onSnapshot(snap=>{
          setTopicComment(snap.docs.map(data=>{return data.data()}));
        });
      } catch{
        console.log('something went wrong, please check your internaet connection!')
      }
      setLoading(false)
    }

    async function saveClick(){
      if(isSaved){
        let index = allSaved.indexOf(postId)
         setAllSaved(allSaved.splice(index,1));
        try{
           await db.collection('users').doc(currentUser.uid).update({
               saved: allSaved
           })
           setSave(false);
        }catch{
            console.log('something went wrong')
        }
    }
    else{
        setAllSaved(allSaved.push(postId))
        try{
            await db.collection('users').doc(currentUser.uid).update({
                saved:allSaved,
            })
            setSave(true);
        }
        catch{
            console.log('something went wrong!')
        }
    }
    }
    async function handleComment(e){
      setLoad(true)
      e.preventDefault();
      const path = window.location.pathname;
      const id = path.substring(path.lastIndexOf('/')+1);

      if(inputComment==''){
        return;
      }
        try{
          await db.collection(`posts/${id}/comments`).add({
            user:currentUser.uid,
            comment: inputComment,
            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
          })
        }
        catch{
          console.log('something went wrong no able to comment on this post!!')
        }
        setInputComment('')
        setLoad(false)
        UpdateCoins(currentUser.uid, 2);
        UpdateNotificationForCoins(currentUser.uid, 2, 'commenting !!');
    }

    return(
        <div>
        {topic==null  ? 
            <div style={{paddingTop:'100px'}} className={'loading-box'}>
              <div className={'loader'}></div>
            </div>
         :     
        <div className={'topic-page'}>
        
        
            <div className={'topic-section'}>
                 <div className={'header'}>
                           <h1>{topic.title}</h1>
                           <h4>{topic.tag}</h4>
                           <div className="sub-heading">
                            {currentUser&&currentUser.uid==topic.user ? 
                              <React.Fragment>
                                <div>
                                  <EditPost post={topic} id={postId}/>
                                </div>
                                <div>
                                  <DeletePost id={postId}/>
                                </div>
                              </React.Fragment>
                              :
                              null
                            }
                            {topicComment!==null && currentUser ? 
                              <div  onClick={()=>saveClick()}>
                                <div className={'header-heading-save'}>
                                    <Button
                                      variant="outlined"
                                      color="primary"
                                      size="small"
                                      startIcon={<AiFillSave/>}
                                    >{isSaved? 'Saved': 'Save'}</Button>
                                </div>
                               </div>
                            : 
                              <div></div>
                            }
                           </div>
                           
                    <hr/>
                    <text>Post created by :</text>
                    {user==null? null:
                    <div className={'auther'}>
                        <div className={'auther-icon'}>
                            <img src={user.profile_image==null ? Default : user.profile_image=''? Default : user.profile_image} />
                        </div>
                        {currentUser ? 
                        <Link to={`/user/${topic.user}`} className="link-user" style={{textDecorationLine:'none'}}>
                          <text >{user.username}</text>
                        </Link> 
                        : 
                        <div className="link-user" style={{textDecorationLine:'none'}}>
                          <text >{user.username}</text>
                        </div> }
                        
                    </div>
                    }
                    
                      <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
                        <a target="_blank" href={decoratedHref} key={key}>
                            {decoratedText}
                        </a>)} ><p style={{whiteSpace:'pre-wrap',paddingTop : '10px',paddingLeft : '8px'}}  className={'topic-description'}>{parse(topic.description)}</p></Linkify>
                      
                 </div>  
      
           </div>
           <div className={'comment-box'}>
                <div className={'comment-reply-box'}>
                <Form onSubmit={(e)=>handleComment(e)}>
                <TextField
                    id="standard-textarea"
                   label="Comment"
                    placeholder=""
                    value={inputComment} onChange={(e)=>setInputComment(e.target.value)}
                    disabled = {currentUser ? false : true}
                    rowsMax={5}
                    multiline
                    fullWidth
                   />
                  {/* <Form.Control as="textarea" rows={3} style={{resize:'none'}} value={inputComment} onChange={(e)=>setInputComment(e.target.value)}/> */}
                  <Button
                            size="small"
                             type='submit'
                             variant="contained"
                             color="primary"
                             endIcon={<SendIcon/>}
                             style={{width:'fit-content',margin:'10px 4px 0 0'}}
                             disabled={load || inputComment==''}
                             > 
                            comment
                  </Button>
                </Form>
                </div>
           </div>
           <div className={'comments'}>
               <h4>Comments</h4>
               <hr/>
                <div className={'all-replies'}>
                  {topicComment!==null ?
                       <div>
                           {topicComment.map(data=>{
                             return <Comment currentUser = {currentUser} data={data}/>
                           })}
                       </div>
                       :
                       <text>no comments yet</text>
                  }

                </div> 
           </div>
        </div>
        }
        </div>
    );
}

