import React from 'react'
import './Home.css'
import MissionEd_logo from './../../assets/MissionEd_logo.svg'
import {Button} from '@material-ui/core'
import {useAuth} from './../../contexts/AuthContext'
import {Redirect,BrowserRouter as Router, Switch} from 'react-router-dom'
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import MenuDrawer from './../Navigation/Drawer'
import {Route} from 'react-router-dom'
import Feed from './../Feed/Feed'
import Following from './../network/Following'
export default function Home() {
    const {currentUser} = useAuth()

    return (
        <div className={'feed-page'}>
                  {console.log(currentUser)}
                  {currentUser==null ? <Redirect to='/welcome'/>: null}
           
            <Feed/>
        </div>
    )
}
