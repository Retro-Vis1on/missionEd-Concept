import React, { useEffect, useState } from 'react'
import './Welcome.css'
import {useAuth} from '../../contexts/AuthContext'
import {Redirect} from 'react-router-dom'
import Typewriter from "typewriter-effect";
import learning from './../../assets/learning.jpg'
import Feedback from './../Navigation/FeedBack'
import { userdb } from '../../firebase';
import PersonIcon from '@material-ui/icons/Person';
import Footer from './../Footer-pg/Footer'
import './../Footer-pg/Footer.css';

const Welcome = (props) =>{
     const {currentUser} = useAuth()
     const[userCount, setUserCount] = useState(0);

     useEffect(()=>{
       GetCount();
     },[])

     async function GetCount(){
       try{
         userdb.onSnapshot(snap=>{
           setUserCount(snap.docs.length);
         })
       }
       catch{
         console.log('error getting counts')
       }
     }


     return(
       <div>
       <div className="bg_image">
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
         <img className='images' src={learning} alt='learning'/>

         </div>      
         <div className="right">
    
            <h1>Welcome to MissionEd Forum!</h1>
            <p className="para">Connect with potential recruiters<br/>Collabrate with your friends<br/> Win exciting rewards!</p>
            <div className='buttons'>
                          <label htmlFor='login-button' >
                            <text className='action-button'>Login</text>
                              {/* <Button variant="contained" color="primary" >LOGIN</Button>{'    '} */}
                          </label>
                          <label htmlFor='signup-button'>
                             <text className='action-button' >Join Now</text>
                              {/* <Button  variant="outlined"  color="primary" style={{ marginLeft: '.5rem'}}><span className="menu" >Join Now</span></Button> */}
                          </label>
                        
       </div>
         </div>
    <Feedback/> 




      </div>
        <div style={{display:'flex',marginTop:'200px',marginBottom:'100px',flexDirection:'row',justifyContent:'center'}}>
            <div className={'user-number'} style={{paddingBlock:'20px',paddingInline:'80px',boxShadow:'0px 0px 7px 0px rgba(0,0,0,0.75)',display:'flex',flexDirection:'column',alignItems:'center',borderRadius:'10px',backgroundColor: '#0cbaba',backgroundImage: 'linear-gradient(315deg, #eec0c6 0%, #7ee8fa 74%)',
              }}>
                <PersonIcon style={{fontSize:'120px',color:'#436967'}}/>
                <text style={{color:'rgb(131, 131, 131)',fontSize:'40px',textShadow:"0px 0px 1px rgba(0,0,0,0.75)",fontWeight:'500'}}>USERS</text>
                <h1>{userCount}</h1>
            </div>
      </div>
      {/*<Footer/>*/}
      </div>
    );
 } 

        
export default Welcome;