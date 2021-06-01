import React, { useState } from 'react'
import {RiAccountCircleFill} from 'react-icons/ri'
import { Link } from 'react-router-dom'
import Default from '../../assets/default.jpg'
import {userdb} from './../../firebase'
// import GetProfile from './../../config/getProfile'
export default function Comment(props) {
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
                    <div className={'commenter-auther'} style={{display : 'flex'}}>
                        <div className={'commenter-icon'}>
                            <img src={user.profile_image==null ? Default : user.profile_image}/>
                        </div>
                        <div className="commenter-content" style={{border : '2px solid white',backgroundColor : '#e6e6e6',borderRadius : '10px',marginLeft : '10px',width : '80%',padding : '5px'}}>
                          <Link to={`/user/${props.data.user}`} style={{textDecorationLine:'none',display : 'block'}}>
                            <text>{user.username}</text>
                          </Link>
                          <text style={{fontSize:'15px'}}>{props.data.comment}</text>
                        </div>
                    </div>
            <div>
            
            <hr/>
        </div>
    </div>
    }
</div>
  );    
}