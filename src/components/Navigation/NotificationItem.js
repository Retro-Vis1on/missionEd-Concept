import React,{ useState, useEffect, useRef} from 'react'
import {userdb, db} from './../../firebase';
import CoinLogo from './../../assets/coin.svg' 
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Fade from '@material-ui/core/Fade';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {useAuth} from './../../contexts/AuthContext'
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Default from './../../assets/default.jpg'
import TimeDiff from './../../apis/TimeDiff'
import firebase from 'firebase'
import {Link} from 'react-router-dom'
export default function NotificationItem(props) {
    const[user,setUser] = useState(null);

  useEffect(()=>{
    GetUser();
  },[props.data]);

   async function GetUser(){
       if(props.data.follower){
           try{
               await userdb.doc(props.data.follower).get().then(data=>{
                  setUser(data.data());
               })
            }  
            catch{
                console.log('something went wrong!')
            }
        }
   }

 
    return (
        <div style={{display:'flex'}}>
           {props.data.follower?
              <img src={user? user.profile_image: null} style={{marginBlock:'3px'}} style={{alignSelf:'center'}}/>
              :
              null
            }
           <text style={{alignSelf:'center'}}>{props.data.msg}</text>
        </div>
    )
}
