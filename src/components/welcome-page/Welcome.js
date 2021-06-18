import React, { useEffect, useState } from 'react'
import './Welcome.css'
import {useAuth} from '../../contexts/AuthContext'
import {Redirect} from 'react-router-dom'
import Typewriter from "typewriter-effect";
import {Button,TextField} from '@material-ui/core'
import learning from './../../assets/learning.jpg'
import MediaQuery from 'react-responsive'
import Feedback from './../Navigation/FeedBack'
import { userdb } from '../../firebase';
import Card from '@material-ui/core/Card';
import PersonIcon from '@material-ui/icons/Person';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PhoneEnabledIcon from '@material-ui/icons/PhoneEnabled';
import MailIcon from '@material-ui/icons/Mail';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
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
         <img className='images' src={learning}/>

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

{/*footer starts from here */}
<footer class="footer-section" style={{backgroundColor:"#30343f"}}>
<div class="container" >
<div class="footer-cta pt-3 pb-0"><div class="row">
<div class="col-xl-5  col-md-5 mb-30 footer-info ">
<div class="single-cta">
<div class="cta-text"><h5>< LocationOnIcon style={{fontSize:'30px',color:'#ff6200'}}/>Find Us</h5><span>Goa Institute of Management, Goa, 202010</span></div></div>
</div>
<div class="col-xl-4 col-md-4 mb-30 footer-info">
<div class="single-cta pl-4">
<div class="cta-text"><h5><PhoneEnabledIcon style={{fontSize:'30px',color:'#ff6200'}}/>Call Us</h5><span>+91-9674037142</span></div></div></div>
<div class="col-xl-3 col-md-4 mb-30 ">
<div class="single-cta pl-4">
<div class="cta-text"><h5><MailIcon style={{fontSize:'30px',color:'#ff6200'}}/>Mail Us</h5><span>missioned@gmail.com</span></div></div></div></div>
</div>


<div class="footer-content pt-1 pb-1">
<div class="row">
<div class="col-xl-4 pt-4 pl-4 col-lg-4 mb-50">
<div class="footer-widget">
<div class="footer-logo"></div>
<div class="footer-text"><p> Welcome to MissionEd Forum <br/>Platform For Discussion and Learning</p>

<div class="footer-social-icon footer-info"><span>Follow Us</span><br/>
<a href="https://www.facebook.com/MissionEd2020/"><FacebookIcon  style={{fontSize:'40px',color:'#ff6200'}}/></a>
<a href="https://www.instagram.com/mission_ed/"><InstagramIcon style={{fontSize:'40px',color:'#ff6200'}}/></a>
<a href="https://www.linkedin.com/company/missioned"><LinkedInIcon style={{fontSize:'40px',color:'#ff6200'}}/></a>
<a href="https://missioned.in/blog/"><FormatBoldIcon style={{fontSize:'40px',color:'#ff6200'}}/></a>
</div></div></div>

</div>
{/*
<div class="col-xl-4  col-lg-4 col-md-6 mt-3 pt-3 pl-5">
<div class="footer-widget">
<div class="footer-widget-heading"><h3>Useful Links</h3></div>
<ul class="mt-3" style={{listStyleType:"none" }}>
<li><a href="/" >Home</a></li>
<li><a href="/network" >Network</a></li>
<li><a href="/messages" >Message</a></li>
<li><a href="/profile" >Profile</a></li>
</ul></div></div>



<div class="col-xl-4  col-lg-4 col-md-6 mt-4 pl-5">
<div class="footer-widget">
<div class="footer-widget-heading footer-info"><h3>Post About </h3></div>
<ul class="mt-3 " style={{listStyleType:"none"}}>
<li>General Topic</li>
<li>Internships</li>
<li>Questions</li>
<li>Placement</li>
<li>Experience</li>
</ul>
</div></div>
*/}
</div>

</div>
</div>


<div class="copyright-area" style={{backgroundColor:"#202020"}}>
<div class="container">
<div class="row">
<div class="col-xl-6 col-lg-6 text-center text-lg-left">
<div class="copyright-text" style={{color:"#878787"}}><p>Copyright © 2021, All Right Reserved
<a href="https://www.missioned.in/" > MissionEd</a></p></div></div>
<div class="col-xl-6 col-lg-6 d-none d-lg-block text-right">
<div class="footer-menu">
<ul id="menu"  style={{listStyleType:"none"}}>
<li><a href="/" style={{textDecoration:"none"}}>Home</a></li>
<li><a href="#" >Terms</a></li>
<li><a href="#" >Privacy</a></li>
<li><a href="#">Policy</a></li>
<li><a href="#">Contact</a></li></ul>
</div></div>
</div></div></div>
</footer>

    </div>
    );
 } 

        
export default Welcome;