import React,{ useState, useEffect, useRef} from 'react'
import './Notification.css'
import {userdb, db} from './../../firebase';
import CoinLogo from './../../assets/coin.svg' 
import {useAuth} from './../../contexts/AuthContext'
import {animate, motion} from 'framer-motion'
import NotificationItem from './Notification-Item'

 export default function Notification() {
    const {currentUser} = useAuth();
    const [numberNote, setNumberNote] = useState(0);
    const [notifications, setNotifications] = useState(null);
    
    useEffect(()=>{
        GetNotificationCount();
        GetNotification();
      },[])
      
      async function GetNotificationCount(){
        try{
            db.collection(`users/${currentUser.uid}/notifications`).where('seen','==', false).onSnapshot(snap=>{
               setNumberNote(snap.docs.length);
            })
        }catch{
          console.log('something went wrong!')
        }
      }
    
    
      async function GetNotification(){
        try{
            db.collection(`users/${currentUser.uid}/notifications`).orderBy('timestamp','desc').onSnapshot(snap=>{
               setNotifications(snap.docs.map((data)=>{return {id: data.id ,data:data.data()}}));
            })
        }catch{
          console.log('something went wrong!')
        }
      }
       
     return (
         <div className='notification-page'>
           <div className='notification-section'>
           
            {notifications==null?
                      <div className={'loading-box'}>
                        <div className={'loader'}></div>
                      </div>
                        :
                      <div>
                        {notifications.map((data)=>{
                          return(
                            <NotificationItem data={data.data} id={data.id}/>
                          );
                        })}
                      </div>
                    }
           </div>
         </div>
     )
 }
 