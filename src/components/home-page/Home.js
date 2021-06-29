import React,{useEffect} from 'react'
import './Home.css'
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import {useAuth} from './../../contexts/AuthContext'
import {Redirect,BrowserRouter as Router, Switch} from 'react-router-dom'
import Feed from './../Feed/Feed'
import Footer from './../Footer-pg/Footer'
import Feedback from './../Navigation/FeedBack'
import {FeedProvider} from './../../contexts/FeedContext'
import CreateTopic from '../Navigation/CreatePost';

export default function Home() {

    useEffect(()=>{
        
      // Tutorial for post

        if( (localStorage.getItem('introNavState')==='shown' || localStorage.getItem('introNavSmallState')==='shown') && localStorage.getItem('introFeed') !== 'shown' ) {
          introJs().setOptions({
              disableInteraction: true,
              steps: [{
                title: 'Welcome',
                intro: '<p>Welcome to MissionEd Forum! 👋</p>'
              },
              {
                title: 'Create Post',  
                element: document.querySelector('.create-post-intro'),
                intro: '<p>To create a post write contents in the input fields.</p>',
                
              },
              {
                title: 'Feed',
                element: document.querySelector('.feed-intro'),
                intro: '<p>Explore latest feed and news regarding placement, internship and more. Use tags to filter posts.</p> <img src="/tag.png" />'
              }]
            }).start();
            
            localStorage.setItem('introFeed','shown');
        }
        
    },[])
  

    const {currentUser} = useAuth()

    return (
        
        <div className={'feed-page'}>
        {currentUser==null ? <Redirect to="/welcome"/>: null}
            <div className="create-post-intro" >
            <CreateTopic />
            </div>
            <div className="feed-intro" >
            <Feed /> 
            </div>
            <div className="feedback-intro">
            <Feedback  />
            </div>
            {/* <Footer/>
            <Feed/>
            <Feedback/> */}
            {/*<Footer/>*/}
        </div>
        
    )
}