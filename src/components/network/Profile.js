import React, { useState, useEffect } from 'react'
import {RiAccountCircleFill} from 'react-icons/ri'
import {MdLocationOn} from 'react-icons/md'
import Default from './../../assets/default.jpg'
import {userdb} from './../../firebase'
export default function Profile(props) {
   const[user,setUser] = useState(null);

    useEffect(() => {
      GetUser();
   }, [props.data])
   
   async function GetUser(){
     try{
         userdb.doc(props.data).onSnapshot(snap=>{
             setUser(snap.data());
         })
     }catch{
         console.log('something went wrong')
     }
   }
    return(
        <div>
        {user==null ?
               <div>
               </div>
            :
        <div>
        <div className={'profile-box'}> 
           <div className={'profile-icon-box'}>
               {/* <RiAccountCircleFill size={90}/> */}
               <img src={user.profile_image==null ? Default : user.profile_image=='' ? Default : user.profile_image}/>
           </div>
           <div className={'profile-text'}>
                 <text className={'profile-username'}>{user.username}</text>
                 <text className={'profile-name'}>{user.name}</text>
                 <text className={'profile-company'}>{user.education}</text>
                 <text className={'profile-about'}>{user.bio}</text>
                <text className={'profile-location'}>
                    {user.location ? <MdLocationOn style={{marginTop : '3px'}} /> : null}
                    {user.location} 
                </text>
           </div>
           <div className={'profile-button-box'}>
                <text className={'profile-message-button'}>message</text>
           </div>
        </div>
        <hr/>
        </div>
        }
       </div>
    );
}