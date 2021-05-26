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
export default function Topic(props) {
    const {currentUser} = useAuth()
    const[loading,setLoading] = useState(true)
    const[topic, setTopic] = useState(null);
    const[topicComment, setTopicComment] = useState(null);
    const[user,setUser] = useState(null);
    const[profile_img,setProfile_img] = useState(Default);
    const[isSaved, setSave] = useState(false)
    const commentRef = useRef();

    useEffect(()=>{
      getTopicData();
    },[])

    async function getTopicData(){
      const path = window.location.pathname;
      const id = path.substring(path.lastIndexOf('/')+1);
      try{
        await db.collection('posts').doc(id).onSnapshot(snap=>{
          setTopic(snap.data())
          userdb.doc(snap.data().user).onSnapshot(snap=>{
              setUser(snap.data())
          })
        });
        await db.collection(`posts/${id}/comments`).onSnapshot(snap=>{
          setTopicComment(snap.docs.map(data=>{return data.data()}));
        });
      } catch{
        console.log('something went wrong, please check your internaet connection!')
      }
      setLoading(false)
    }
    async function saveClick(){
          setSave(!isSaved);
          return;
    }
    async function handleComment(e){
      e.preventDefault();
      const path = window.location.pathname;
      const id = path.substring(path.lastIndexOf('/')+1);

      if(commentRef.current.value==null){
        return;
      }
        try{
          await db.collection(`posts/${id}/comments`).add({
            user:currentUser.uid,
            comment: commentRef.current.value,
            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
          })
        }
        catch{
          console.log('something went wrong no able to comment on this post!!')
        }
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
                           {topicComment!==null? 
                              <div  onClick={()=>saveClick()}>
                              <div className={'header-heading-save'} style={{backgroundColor:isSaved?'black':'white',color:isSaved?'white':'black'}}>
                                  <div className={'header-save-icon'}>
                                  <AiFillSave size={20}/>
                                  </div>
                                  {isSaved? 
                                  <text>Saved</text>
                                  : <text>Save</text>
                                  }
                               </div>
                               </div>
                            : 
                              <div></div>
                            }
                    <hr/>
                    {user==null? null:
                    <div className={'auther'}>
                        <div className={'auther-icon'}>
                            <img src={profile_img} />
                        </div>
                        <h3>{user.username}</h3>
                    </div>
                    }
                    <text  className={'topic-description'}>{topic.description}</text>
                 </div>  
      
           </div>
           <div className={'comment-box'}>
                <div className={'comment-reply-box'}>
                <Form onSubmit={(e)=>handleComment(e)}>
                  <Form.Control as="textarea" rows={3} style={{resize:'none'}} ref={commentRef}/>
                  <Button
                             type='submit'
                             variant="contained"
                             color="primary"
                             endIcon={<SendIcon/>}
                             style={{width:'fit-content',marginLeft:'7px'}}
                             > 
                            comment
                  </Button>
                </Form>
                </div>
           </div>
           <div className={'comments'}>
               <h2 onClick={()=>console.log(topicComment)}>Comments</h2>
               <hr/>
                <div className={'all-replies'}>
                  {topicComment!==null ?
                       <div>
                           {topicComment.map(data=>{
                             return <Comment data={data}/>
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

