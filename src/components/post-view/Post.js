import react, { useState, useEffect} from 'react'
import './Post.css'
import Comment from './Comment'
import {RiAccountCircleFill} from 'react-icons/ri'
import Default from './../../assets/default.jpg'
import {AiOutlineSave,AiFillSave} from 'react-icons/ai'

export default function Topic(props) {
    

    // const[topic, setTopic] = useState(getTopicData);
    const[topicCommnet, setTopicComment] = useState(true);
    const[profile_img,setProfile_img] = useState(Default);
    const[isSaved, setSave] = useState(false)
    // const[saveTopicId, setSaveTopicId] = useState(null)
    // async function getTopicData() {
    //     window.scrollTo(0,0)
    //     const path = window.location.pathname;
    //     const id = path.substring(path.lastIndexOf('/')+1);
    //     let response = await GetTopicById(id);
    //     setTopic(response);
    //     let resp =  await GetProfile(response.username);
    //     if(response!==null){ 
    //         setProfile_img(resp.pop().profile_img);
    //     }
    //     let savestatus = await IsTopicSaved(localStorage.getItem('username'),id);
    //     if(savestatus.length){
    //         setSave(true);
    //         setSaveTopicId(savestatus.pop().id)
    //     }
    //     let comment = await GetCommnet(id)
    //     setTopicComment(comment)
        
    // }
    
    // const[comment, setComment] = useState(null);
    
    // async function isTopicSaved() {
    //         console.log(topic)
    //         let savestatus = await IsTopicSaved(localStorage.getItem('username'),topic.id);
    //         setSave(savestatus);
    // }
       
    // async function commented(){
    //     if(comment==''){
    //         alert('please add comment');
    //         return ;
    //     }
    //     let response =  AddComment(topic.id, localStorage.getItem('username'), comment)
    //     if(response){
    //         console.log(response)
    //         setComment('')
    //     }
    //     await UpdateCoin(localStorage.getItem('username'),5)
    //     window.location.reload(false);
    // }
    async function saveClick(){
        if(!isSaved){
          setSave(true);
          return;
        }
    }
    //     else{
    //         let unsave = await UnSaveTopic(saveTopicId)
    //         console.log(unsave)
    //         setSave(false);
    //         await UpdateCoin(localStorage.getItem('username'),-2);            
    //     }
    // }
    return(
        <div className={'topic-page'}>
            <div className={'topic-section'}>
                 <div className={'header'}>
                     
                           <h1>title of the post</h1>
                           <h4>General</h4>
                           {topicCommnet? 
                              
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
                    <div className={'auther'}>
                        <div className={'auther-icon'}>
                            <img src={profile_img} />
                        </div>
                        <h3>amarpsp10</h3>
                    </div>
                    <text  className={'topic-description'}>description of topic that i want to add</text>
                 </div>  
           </div>
           <div className={'comment-box'}>
                <div className={'comment-reply-box'}>
                  <textarea placeholder={'Comment here ......'} className={'text-area'}/>
                  <text className={'comment-button'} onClick={()=>console.log('commented')}>Comment</text>
                </div>
           </div>
           <div className={'comments'}>
               <h2 onClick={()=>console.log(topicCommnet)}>Comments</h2>
               <hr/>
                <div className={'all-replies'}>
                  {topicCommnet?
                       <div>
                           {/* {topicCommnet.map(data=>{
                             return <Comment username={data.username} comment={data.comment}/>
                           })} */}
                           <Comment/>
                           <Comment/>
                       </div>
                       :
                       <text>no comments yet</text>
                  }

                </div> 
           </div>
        </div>
    );
}

