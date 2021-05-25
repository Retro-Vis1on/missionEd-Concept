import React, { useState } from 'react'
import './Profile.css'
import Default from './../../assets/default.jpg'
import General from './General'
import Rewards from './Rewards'
import Account from './Account'
export default function Profile() {
    const[activeTab, setActiveTab] = useState('general')

    const handleTab = (tab) =>{
        setActiveTab(tab)
    }
    return (
            <div className={'profile-page'}>
            <div className={'profile-page-section'}>

            <div className={'profile-user-card'}>
              <img src={Default}/>
              <div>
                  <h3>Amar Preet Singh</h3>
                  <text>your Personal Accout</text>
              </div>  
            </div>
            <div className={'profile-tabs-section'}>
                <div className={'tabs-options'}>
                    <text onClick={()=>handleTab('general')} className={activeTab==='general'? 'active-tab':null}>General</text>
                    <text onClick={()=>handleTab('rewards')} className={activeTab==='rewards'? 'active-tab':null}>Rewards</text>
                    <text onClick={()=>handleTab('account')} className={activeTab==='account'? 'active-tab':null}>Account</text>
                </div>
                <div className={'active-tab-page'}>
                     {activeTab==='general'? <General/>:null}
                     {activeTab==='rewards'? <Rewards/>:null}
                     {activeTab==='account'? <Account/>:null}
                </div>
            </div>

            </div>
            </div>
    )
}
