import React from 'react'
import './Welcome.css'
import {useAuth} from '../../contexts/AuthContext'
import {Redirect} from 'react-router-dom'
import Typewriter from "typewriter-effect";
import {Button,TextField} from '@material-ui/core'
import learning from './../../assets/learning.jpg'






const Welcome = (props) =>{
     const {currentUser} = useAuth()

     return(
       <div className="bg_image">
        
        {console.log(currentUser)}
        {currentUser && <Redirect to='/'/>}
            <div className="left">
            <Typewriter
options={{
    autoStart: true,
    loop: true,
  }}
            onInit={(typewriter)=> {

            typewriter

            .typeString("Learn and Discuss with")
    
            .pauseFor(10)
            .deleteAll()
            .typeString("Experts & Friends!!!")
            .pauseFor(10)
            .deleteAll()
            .start();
         }}
         />
         <img className='image' src={learning} width={'550px'}/>

         </div>      
         <div className="right">
    
            <h1>Welcome to MissionEd Forum!</h1>
            <p className="para">Connect with potential recruiters<br/>Collabrate with your friends<br/> Win exciting rewards!</p>
            <div className='buttons'>
                          <label htmlFor='login-button' >
                            <text className='action-button'>Log In</text>
                              {/* <Button variant="contained" color="primary" >LOGIN</Button>{'    '} */}
                          </label>
                          <label htmlFor='signup-button'>
                             <text className='action-button' >Join Now</text>
                              {/* <Button  variant="outlined"  color="primary" style={{ marginLeft: '.5rem'}}><span className="menu" >Join Now</span></Button> */}
                          </label>
                        
    </div>
         </div>  
    </div>
    );
        } 


export default Welcome;