import React,{useEffect,useState} from 'react'
import './Network.css'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
// import {FaPlusSquare} from 'react-icons/fa'
// import {GiThreeFriends} from 'react-icons/gi'
// import Profile from './Profile'
// import {FaInbox} from 'react-icons/fa'
import {Link} from 'react-router-dom'
import Profile from './Profile'
export default function Network(){
  
  const{currentUser}  = useAuth();
  const [value, setValue] = React.useState(0);
  const[allFollowing, setAllFollowing] = useState([]);
  const[allFollower, setAllFollwer] = useState([]);
  useEffect(()=>{
     GetFollower();
     GetAllFollowing();
  },[])

  async function GetFollower(){
    try{
      await userdb.where('following','array-contains-any',[currentUser.uid]).onSnapshot(snap=>{
         setAllFollwer(snap.docs.map(data=>{return data.id}));
        })
    } catch{
      console.log('something went wrong')
    }
  }
  async function GetAllFollowing(){
    try{
      userdb.doc(currentUser.uid).onSnapshot(snap=>{
        setAllFollowing(snap.data().following)
      })
    } catch{
      console.log('something went wrong!')
    }
  }
  
    return(
      <div className={'network-page'}>
          
        
                 <Tab/>
        </div>
    );
  
}