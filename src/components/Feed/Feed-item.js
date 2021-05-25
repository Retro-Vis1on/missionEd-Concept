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
          })
        }catch{
            alert('something went wrong!')
        }
    }
    return(
        
        <div>
            
           <div className={'topic-item'}>
            <Link  to={`post/${props.id}`} className={'topic-text'}>
                        <div >
                          <h3 style={{textDecorationLine:'none'}} onClick={()=>console.log('he e')}>{props.data.title}</h3>
                         </div>
                             </Link>
                             <div className={'midle-field'}>
                                <div className={'feed-list-icon'}>
                                    <img src={profile_img}/>
                                </div>
                             <Link to={`/user/${props.data.user}`}>
                                <h4>{username}</h4> 
                             </Link>
                             </div>
                         <div className={'topic-tag'}>
                        <h3>{props.data.tag}</h3>
                        </div>
            </div>
            <hr/>
        </div>
    );
}