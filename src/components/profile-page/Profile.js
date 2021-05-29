import React, { useState , useEffect } from 'react'
import './Profile.css'
import Default from './../../assets/default.jpg'
import General from './General'
import Rewards from './Rewards'
import Account from './Account'
import {userdb} from './../../firebase'
import {useAuth} from './../../contexts/AuthContext'
export default function Profile() {
    const[activeTab, setActiveTab] = useState('general')
    const{currentUser} = useAuth();
    const[user,setUser] = useState(null);
    useEffect(() => {
        GetUser();
    }, [])

    async function GetUser(){
        try{
          userdb.doc(currentUser.uid).onSnapshot(snap=>{
              setUser(snap.data());
          })
        }
        catch{
            console.log('error occured!')
        }
    }
    const handleTab = (tab) =>{
        setActiveTab(tab)
    }
    return (
            <div className={'profile-page'}>
            <div className={'profile-page-section'}>
           {user==null ? <div></div>
           :
            <div className={'profile-user-card'}>
              <img src={user.profile_image==null ? Default : user.profile_image}/>
              <div>
                  <h3>{user.name}</h3>
                  <text>Your Personal Account</text>
              </div>  
            </div>
            }
            <div className={'profile-tabs-section'}>
                <div className={'tabs-options'}>
                    <text style={{marginBottom : '5px'}} onClick={()=>handleTab('general')} className={activeTab==='general'? 'active-tab':null}>General</text>
                    <text style={{marginBottom : '5px'}} onClick={()=>handleTab('rewards')} className={activeTab==='rewards'? 'active-tab':null}>Rewards</text>
                    <text style={{marginBottom : '5px'}} onClick={()=>handleTab('account')} className={activeTab==='account'? 'active-tab':null}>Account</text>
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
