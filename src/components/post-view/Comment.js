import React, { useState } from 'react'
import {RiAccountCircleFill} from 'react-icons/ri'
import { Link } from 'react-router-dom'
import Default from '../../assets/default.jpg'
// import GetProfile from './../../config/getProfile'
export default function Comment(props) {
        const[profile_img, setProfile_img] = useState(Default)
//   async function ProfileImage(){
//     let response =  await GetProfile(props.username);
//      if(response!==null){ 
//          setProfile_img(response.pop().profile_img);
//      }
//      else{
//          setProfile_img(Default);
//      }
//  }

  return(
    <div className={'reply-box'}>
    <div className={'reply'}>
                    <div className={'commenter-auther'}>
                        <div className={'commenter-icon'}>
                            <img src={profile_img}/>
                        </div>
                        <h3>amarpsp10</h3>
                    </div>
            <div>
            <text style={{fontSize:'15px'}}>here is my comment i want to add</text>
            <hr/>
        </div>
    </div>
</div>
  );    
}