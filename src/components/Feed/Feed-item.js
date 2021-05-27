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
    },[])
    
    async function GetUser(){
        try{
          userdb.doc(props.data.user).onSnapshot(snap=>{
              setUsername(snap.data().username) 
            setProfile_img(snap.data().profile_image);
              
          })
        }catch{
            alert('something went wrong!')
        }
    }
    return(
           <div className={'feed-item'}>
            <Link  to={`post/${props.id}`} style={{textDecorationLine:'none'}} className={'feed-title'}>
                        <div>
                          <text style={{textDecorationLine:'none'}}>{props.data.title}</text>
                         </div>
                             </Link>
                             <div className={'midle-field'}>
                                <div className={'feed-list-icon'}>
                                    <img src={profile_img==null ? Default: profile_img}/>
                                </div>
                             <Link to={`/user/${props.data.user}`} style={{textDecorationColor:'none', color:'black'}}>
                                <text>{username}</text> 
                             </Link>
                             </div>
                         <div className={'post-tag'}>
                        <text>{props.data.tag}</text>
                        </div>
        </div>
    );
}