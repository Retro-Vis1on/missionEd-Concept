import React, { useState } from 'react'
import {RiAccountCircleFill} from 'react-icons/ri'
import { Link } from 'react-router-dom'
import Default from '../../assets/default.jpg'
import {userdb} from './../../firebase'
// import GetProfile from './../../config/getProfile'
export default function Comment(props) {
        const[profile_img, setProfile_img] = useState(Default)
        const[user, setUser] = useState(null);
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
                    <div className={'commenter-auther'}>
                        <div className={'commenter-icon'}>
                            <img src={profile_img}/>
                        </div>
                        <h3>{user.username}</h3>
                    </div>
            <div>
            <text style={{fontSize:'15px'}}>{props.data.comment}</text>
            <hr/>
        </div>
    </div>
    }
</div>
  );    
}