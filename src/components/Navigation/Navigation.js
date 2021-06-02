import React,{useState,useEffect,useRef} from 'react'
import './Navigation.css'
import {Button,TextField} from '@material-ui/core'
import Modal from 'react-modal'
import MissionEd_logo from './../../assets/MissionEd_logo.svg'
import {Form, Alert} from 'react-bootstrap'
import {useAuth} from '../../contexts/AuthContext'
import {useHistory,Redirect, Link} from 'react-router-dom'
import DrawerMenu from './Drawer'
import Default from './../../assets/default.jpg'
import CreateTopic from './CreatePost'
import {userdb, db} from './../../firebase'
import Fab from '@material-ui/core/Fab';
import FeedbackIcon from '@material-ui/icons/Feedback';
import Tooltip from '@material-ui/core/Tooltip';
// import Feedback from './Feedback'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
const Navigation = () =>{
    const {signup,login,currentUser} = useAuth()   
    const history = useHistory();
    const loginEmailRef = useRef();
    const loginPasswordRef = useRef();
    const regEmailRef = useRef();
    const regPasswordRef = useRef();
    const regConfirmPasswordRef = useRef();
    const regUsernameRef = useRef();
    const [error,setError] = useState('');
    const [loading, setLoading] = useState(false)
    const[loginModal,setLoginModal] = useState(false);
    const[signUpModal, setSignupModal] = useState(false);
    const[user, setUser] = useState(null);

     useEffect(()=>{
           GetUser();
    },[])
    async function GetUser(){
      if(currentUser){

        try{
          await userdb.doc(currentUser.uid).onSnapshot(snap=>{
            setUser(snap.data());
          })
        }catch{
          console.log('something went wrong')
        }
      }
    }
 
    async function handleSignUp(e){
      e.preventDefault()
      setError('')
      if(regUsernameRef.current.value == '' || regEmailRef.current.value == '' || regPasswordRef.current.value == ''){
        return setError('please fill all required field!')
      }
      if(regPasswordRef.current.value.length<8){
        return setError('Password must be atleast 8 character!')
      }
      
      if(regPasswordRef.current.value !== regConfirmPasswordRef.current.value){
         return setError('password do not match')
       }
      let response = await userdb.where("username","==",regUsernameRef.current.value).onSnapshot(snap=>{
        if(snap.docs.length){
          return setError('Username already exist!')
        }
        else{
          console.log('chala')
          SignUp();
        }
      })

     }

     async function SignUp(){
      
       try{
        setError('')
        setLoading(true)
        let respo = await signup(regEmailRef.current.value, regPasswordRef.current.value);
          db.doc(`users/${respo.user.uid}`).set({
          email:regEmailRef.current.value,
          username:regUsernameRef.current.value,
         })
       } catch{
         setError('Email alredy taken! please sign In')
         return setLoading(false)
       } 
       console.log(currentUser);
      
       setLoading(false)
       onCancelSignup();
     }

     async function handleLogin(e){
       e.preventDefault()
       setError('')
       if(loginEmailRef.current.value === '' || loginPasswordRef.current.value ==''){
         return setError('please fill required field')
       }
       if(loginPasswordRef.current.value.length<8){
         return setError('Password must be atleast 8 character!');
       }
       try{
        setError('')
        setLoading(true)
        await login(loginEmailRef.current.value,loginPasswordRef.current.value);
      } catch{
         setError('Invalid Email or password')
         return setLoading(false);
       }
       onCancelLogIn()
     }

     const onCancelLogIn=(props)=>{
         setError('')
         setLoginModal(false);
         setLoading(false);
     }
     const onCancelSignup=(props)=>{
        setError('')
        setSignupModal(false);
        setLoading(false);
    }

     return(
         <div>
           {console.log(currentUser)}
           {currentUser==null ? <Redirect to='/welcome'/>: null}
           {/* {currentUser && <Redirect to='/'/>} */}
            <div className='navbar'>
           <Link to='/' style={{textDecorationLine:'none'}}>
                <div className={'mission-ed-logo'}>
                     <img className='log-image' src={MissionEd_logo} width={'40px'}/>
                     <text  className='logo-text'>MissionEd Forum</text>
                </div>
           </Link>
                <div className='nav-items'> 
                {currentUser ?
                <div className={'navbar-menu'} style={{display:'flex',flexDirection:'row'}}>
                  <CreateTopic/>
                  <img src={user==null ? Default : user.profile_image==null ? Default : user.profile_image==''? Default : user.profile_image}/>
                  <DrawerMenu/>
                </div> 
                :
                <div>
                <Button id='login-button' variant="contained" style={{color:'white',backgroundColor:'#ff7824'}} color="secondary" onClick={()=>{
                   setSignupModal(false);
                   setLoginModal(true)
                   }}>Login</Button>
                <Button id='signup-button' variant="outlined" color="secondary" style={{fontWeight:'bold',color:'#ff7824',borderColor:'#ff7824'}} onClick={()=>{
                  setLoginModal(false)
                  setSignupModal(true)}}>Join Now</Button>
                </div>
                }
                </div>      
            </div>
            <Modal isOpen={loginModal} onRequestClose={()=>onCancelLogIn()} 
                           style={{
                            content : {
                                borderRadius: '20px',
                                top                   : '50%',
                                left                  : '50%',
                                right                 : 'auto',
                                bottom                : 'auto',
                                marginRight           : '-50%',
                                transform             : 'translate(-50%, -50%)',
                                backgroundColor:  'white',
                              },
                           }}>
                            <Form>
                            <div style={{textAlign:'center'}}>
                            <img src={MissionEd_logo} width={'70px'}/>
                            <h3>Welcome Back to forum!</h3>
                            </div>
                            {error && <Alert variant="danger">{error}</Alert>}
                              <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" ref={loginEmailRef}/>
                              </Form.Group>
                              <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" ref={loginPasswordRef}/>
                              </Form.Group>
                              <div className='form-buttons'>
                              <Button variant="outlined" color="primary" onClick={()=>onCancelLogIn()}>Cancel</Button>
                              <Button disabled={loading} onClick={(e)=>handleLogin(e)} variant="contained" color="primary" type="submit">
                                Login
                              </Button>
                              </div>
                            </Form>
            </Modal>
            <Modal isOpen={signUpModal} onRequestClose={()=>onCancelSignup()} 
                           style={{
                            content : {
                                borderRadius: '20px',
                                top                   : '50%',
                                left                  : '50%',
                                right                 : 'auto',
                                bottom                : 'auto',
                                marginRight           : '-50%',
                                transform             : 'translate(-50%, -50%)',
                                backgroundColor:  'white',
                              },
                          }}>
                         <Form  onSubmit={handleSignUp}>
                            <div style={{textAlign:'center'}}>
                            <img src={MissionEd_logo} width={'70px'}/>
                            <h3>Welcome To MissionEd-Forum</h3>
                            {error && <Alert variant="danger">{error}</Alert>}
                            </div>
                            <Form.Group controlId="formBasicUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="username" placeholder="create username" ref={regUsernameRef}/>
                              </Form.Group>
                              <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" ref={regEmailRef}/>
                              </Form.Group>
                              <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" ref={regPasswordRef}/>
                              </Form.Group>
                              <Form.Group controlId="formBasicConfirmPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control type="password" placeholder="Confirm Password" ref={regConfirmPasswordRef}/>
                              </Form.Group>
                              <div className='form-buttons'>
                              <Button variant="outlined" color="primary"  onClick={()=>onCancelSignup()}>Cancel</Button>
                              <Button disabled={loading} variant="contained" color="primary" type="submit">
                                Signup
                              </Button>
                              </div>
                            </Form>
            </Modal>
         </div>
     );
}

export default Navigation;