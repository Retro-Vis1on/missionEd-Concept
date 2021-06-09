import React, { useState, useEffect } from 'react'
import {RiAccountCircleFill} from 'react-icons/ri'
import {MdLocationOn} from 'react-icons/md'
import Default from './../../assets/default.jpg'
import {userdb} from './../../firebase'
import {animate, motion} from 'framer-motion'
import {Button} from '@material-ui/core'
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
        <motion.div initial={{x:-300,opacity:0}}
        animate={{x:0, opacity:1}}
        transition={{duration:0.5,}}>
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
           <Button 
             style={{height:'fit-content',color:'white',borderColor:'white',borderWidth:'2px'}}
             variant='outlined'>
               message
           </Button>
            </div>
        </div>
       
        </motion.div>
        }
       </div>
    );
}