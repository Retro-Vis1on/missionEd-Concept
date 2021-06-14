import React,{useState,useEffect} from 'react'
import {db, userdb} from './../../firebase'
import Default from './../../assets/default.jpg'
import {Link} from 'react-router-dom'
export default function LikeProfile(props) {
    const[user,setUser] = useState(null);
    useEffect(()=>{
      GetUser();
    },[props.id])

    async function GetUser(){
       try{
         await userdb.doc(props.id).get().then(data=>{
             setUser(data.data());
         })
       }
       catch{
           console.log('something went wrong!')
       }
    }
    return (
        <div>
          {user ? 
            <Link to={`/user/${props.id}`} style={{textDecorationLine:'none'}}>
            <div className={'like-profile'}>
              <img src={user.profile_image==null? Default: user.profile_image==''? Default: user.profile_image}/>
              <text>{user.name ? user.name : user.username}</text>
            </div>
            </Link>
            :
            null  
        }
        </div>
    )
}
