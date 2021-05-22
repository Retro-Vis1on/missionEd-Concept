import React from 'react'
import './Home.css'
import MissionEd_logo from './../../assets/MissionEd_logo.svg'
import {Button} from '@material-ui/core'
import {useAuth} from './../../contexts/AuthContext'
import {Redirect} from 'react-router-dom'
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import MenuDrawer from './../Navigation/Drawer'
export default function Home() {
    const {logout,currentUser} = useAuth()

    async function handleLogout(){
        try{
            await logout()
        }catch{
            alert('Please check your internet connection!')
        }
    }
    return (
        <div className='navbar'>
            {console.log(currentUser)}
            {currentUser==null ? <Redirect to='/welcome'/>: null}
        <div className={'mission-ed-logo'}>
             <img className='log-image' src={MissionEd_logo} width={'40px'}/>
             <text  className='logo-text'>MissionEd-Forum</text>
             {/* <Button variant='contained' color='primary' onClick={()=>handleLogout()}>logout</Button> */}
        </div>
        <div className='nav-items'>
        <MenuDrawer/>
        </div>
           
    </div>
    )
}
