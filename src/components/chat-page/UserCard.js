import React, { useState } from 'react'
import Default from './../../assets/default.jpg'
import {userdb,db} from './../../firebase'
import {useAuth} from './../../contexts/AuthContext'
export default function UserCard(props) {
    const[user, setUser] = useState(null);
    const{currentUser} = useAuth();

    useState(()=>{
        console.log(props.data)
      GetUser()
    },[])

    async function GetUser(){
        let uid = currentUser.uid === props.data.users[0] ? props.data.users[1] : props.data.users[0]
        try{
         await userdb.doc(uid).onSnapshot(snap=>{
            setUser(snap.data())
          })
        }catch{
            alert('something went wrong!')
        }
    }

    return (
        <div>
        {user==null ?
            <div></div>
            :
            <div className={'chat-user-card'}>
            <img src={user.profile_image==null ? Default : user.profile_image}/>
            <text>{user.username}</text>
            </div>
        }
        </div>
    )
}
