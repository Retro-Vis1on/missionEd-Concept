import React, {useEffect, useState } from 'react'
import { Link} from 'react-router-dom'
import Default from './../../assets/default.jpg'
import {userdb} from './../../firebase'
// import GetProfile from './../../../config/getProfile'
export default function FeedItem(props) {
    const[profile_img,setProfile_img] = useState(Default);
    const[username, setUsername] = useState('');

    useEffect(()=>{
       GetUser();
    },[props.data.user])
    
    async function GetUser(){
        try{
          userdb.doc(props.data.user).onSnapshot(snap=>{
            if(snap.exists){
                setUsername(snap.data().username) 
                setProfile_img(snap.data().profile_image);
            }
              
          })
        }catch{
            alert('something went wrong!')
        }
    }
    return(
           <div className={'feed-item'}>
            <Link  to={`post/${props.id}`} style={{textDecorationLine:'none'}} className={'feed-title'}>
                        
                          <text style={{textDecorationLine:'none'}}>{props.data.title}</text>
                         
            </Link>
                    <div className={'midle-field'}>
                                <div className={'feed-list-icon'}>
                                    <img src={profile_img==null ? Default: profile_img=='' ? Default : profile_img}/>
                                </div>
                             <Link to={`/user/${props.data.user}`} style={{textDecorationColor:'none', color:'black'}}>
                                <text className="username">{username}</text> 
                             </Link>
                    </div>    
                    <div className={'post-tag'}>
                            <text>{props.data.tag}</text>
                    </div>
                    <div className={'post-likes'}>
                        <text>{props.data.liked ? props.data.liked.length: 0}</text>
                        <text style={{fontSize:'10px'}}>Likes</text>
                    </div>
        </div>
    );
}