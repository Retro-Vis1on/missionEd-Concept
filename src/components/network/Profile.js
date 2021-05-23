import React from 'react'
import {RiAccountCircleFill} from 'react-icons/ri'
import {MdLocationOn} from 'react-icons/md'
import Default from './../../assets/default.jpg'

export default function Profile(props) {
    return(
        <div>


        <div className={'profile-box'}> 
           <div className={'profile-icon-box'}>
               {/* <RiAccountCircleFill size={90}/> */}
               <img src={Default}/>
           </div>
           <div className={'profile-text'}>
                 <text className={'profile-username'}>amarpsp10</text>
                 <text className={'profile-name'}>Amar Preet Singh</text>
                 <text className={'profile-company'}>UIET, Punjab University,chd</text>
                 <text className={'profile-about'}>web developer at missioned</text>
                <text className={'profile-location'}>
                    <MdLocationOn />Jaipur, Rajasthan
                </text>
           </div>
           <div className={'profile-button-box'}>
                <text className={'profile-message-button'}>message</text>
           </div>
        </div>
        <hr/>
        </div>
    );
}