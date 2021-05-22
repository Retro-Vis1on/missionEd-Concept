import React, {useState } from 'react'
import { Link} from 'react-router-dom'
import Default from './../../assets/default.jpg'
// import GetProfile from './../../../config/getProfile'
export default function FeedItem(props) {
    const[profile_img,setProfile_img] = useState(Default);
    
    // async function ProfileImage(){
    //     let response =  await GetProfile(props.data.username);
    //      if(response!==null){ 
    //          setProfile_img(response.pop().profile_img);
    //      }
    //      else{
    //          setProfile_img(Default);
    //      }
    //  }
    return(
        
        <div>
           <div className={'topic-item'}>
            <Link  className={'topic-text'}>
                        <div >
                          <h3 style={{textDecorationLine:'none'}} onClick={()=>console.log('he e')}>here is the title of post</h3>
                         </div>
                             </Link>
                             <div className={'midle-field'}>
                                <div className={'feed-list-icon'}>
                                    <img src={profile_img}/>
                                </div>
                                <h4>amarpsp10</h4> 
                             </div>
                         <div className={'topic-tag'}>
                        <h3>General</h3>
                         </div>
            </div>
            <hr/>
        </div>
    );
}