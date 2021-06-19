import React from 'react'
import './Home.css'
import {useAuth} from './../../contexts/AuthContext'
import {Redirect,BrowserRouter as Router, Switch} from 'react-router-dom'
import Feed from './../Feed/Feed'
import Footer from './../Footer-pg/Footer'
import Feedback from './../Navigation/FeedBack'
import {FeedProvider} from './../../contexts/FeedContext'
import CreateTopic from '../Navigation/CreatePost';

export default function Home() {
    const {currentUser} = useAuth()

    return (
        
        <div className={'feed-page'}>
        {currentUser==null ? <Redirect to="/welcome"/>: null}
            <CreateTopic />
            <Feed/>
            <Feedback/>
            <Footer/>
        </div>
        
    )
}
