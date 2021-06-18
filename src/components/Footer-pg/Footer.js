import React from "react";
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PhoneEnabledIcon from '@material-ui/icons/PhoneEnabled';
import MailIcon from '@material-ui/icons/Mail';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import './Footer.css';


export default function Footer() {


    return (
<footer class="footer-section" style={{backgroundColor:"black"}}>
<div class="container" >
<div class="footer-cta pt-5 pb-1"><div class="row">
<div class="col-xl-5  col-md-5 mb-30 footer-info ">
<div class="single-cta">
<div class="cta-text"><h4>< LocationOnIcon style={{fontSize:'30px',color:'#ff6200'}}/>Find Us</h4><span>Goa Institute of Management, Goa, 202010</span></div></div>
</div>
<div class="col-xl-4 col-md-4 mb-30 footer-info">
<div class="single-cta pl-4">
<div class="cta-text"><h4><PhoneEnabledIcon style={{fontSize:'30px',color:'#ff6200'}}/>Call Us</h4><span>+91-9674037142</span></div></div></div>
<div class="col-xl-3 col-md-4 mb-30 ">
<div class="single-cta pl-4">
<div class="cta-text"><h4><MailIcon style={{fontSize:'30px',color:'#ff6200'}}/>Mail Us</h4><span>missioned@gmail.com</span></div></div></div></div>
</div>


<div class="footer-content pt-3 pb-5">
<div class="row">
<div class="col-xl-4 pt-4 pl-4 col-lg-4 mb-50">
<div class="footer-widget">
<div class="footer-logo"></div>
<div class="footer-text"><p> Welcome to MissionEd Forum <br/>Platform For Discussion and Learning</p>

<div class="footer-social-icon footer-info"><span>Follow Us</span><br/>
<a href="https://www.facebook.com/MissionEd2020/"><FacebookIcon  style={{fontSize:'50px',color:'#ff6200'}}/></a>
<a href="https://www.instagram.com/mission_ed/"><InstagramIcon style={{fontSize:'50px',color:'#ff6200'}}/></a>
<a href="https://www.linkedin.com/company/missioned"><LinkedInIcon style={{fontSize:'50px',color:'#ff6200'}}/></a>
<a href="https://missioned.in/blog/"><FormatBoldIcon style={{fontSize:'50px',color:'#ff6200'}}/></a>
</div></div></div>

</div>

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
</div></div></div>

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
    );
//rgb(68,71,83) 
}
