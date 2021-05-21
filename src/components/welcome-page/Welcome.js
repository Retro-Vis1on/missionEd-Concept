import React,{useState,useEffect,useRef} from 'react'
import './Welcome.css'
import {Button,TextField} from '@material-ui/core'
import Modal from 'react-modal'
import MissionEd_logo from './../../assets/MissionEd_logo.svg'
import {Form, Alert} from 'react-bootstrap'
import {useAuth} from '../../contexts/AuthContext'
const Welcome = () =>{
    const {signup, currentUser} = useAuth()   
  
    const loginEmailRef = useRef();
    const loginPasswordRef = useRef();
    const regEmailRef = useRef();
    const regPasswordRef = useRef();
    const regConfirmPasswordRef = useRef();
    const [error,setError] = useState('');
    const [loading, setLoading] = useState(false)
     const[loginModal,setLoginModal] = useState(false);
     const[signUpModal, setSignupModal] = useState(false);

    async function handleSignUp(e){
      e.preventDefault()
      setError('')
       if(regPasswordRef.current.value !== regConfirmPasswordRef.current.value){
         return setError('password do not match')
       }
       try{
        setError('')
        setLoading(true)
       let response =  await signup(regEmailRef.current.value, regPasswordRef.current.value)
       console.log(response);
       } catch{
         setError('Failed to Create an accont')
       } 
       setLoading(false)
     }

     const onCancelLogIn=(props)=>{
         setLoginModal(false);
     }
     const onCancelSignup=(props)=>{
        setSignupModal(false);
    }

     return(
         <div>
            <div className='navbar'>
                <div className={'mission-ed-logo'}>
                     <img className='log-image' src={MissionEd_logo} width={'40px'}/>
                     <text  className='logo-text'>MissionEd-Forum</text>
                </div>
                <div className='nav-items'> 
                <Button variant="contained" color="primary" onClick={()=>setLoginModal(true)}>Login</Button>
                <Button variant="outlined" color="primary" onClick={()=>setSignupModal(true)}>Join Now</Button>
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
                              <Button disabled={loading} onClick={()=>console.log('skdlfj')} variant="contained" color="primary" type="submit">
                                Login
                              </Button>
                              </div>
                            </Form>

                       {/* <div style={{textAlign:'center'}}>
                            <img src={MissionEd_logo} width={'70px'}/>
                            <h3>Welcome Back to forum!</h3>
                            </div>
                        <div className='form-inputs'>
                        <TextField style={{marginBlock:'5px'}} required={true} id="outlined-basic" onChange={(event)=>console.log(event.target.value)} label="Email" variant="outlined" type='email'/>
                        <TextField style={{marginBlock:'5px'}} required={true} id="outlined-basic" onChange={(event)=>console.log(event.target.value)} label="Password" variant="outlined" type='password'/>
                        </div>
                        <div className='form-buttons'>
                        <Button variant="outlined" color="primary" onClick={()=>onCancelLogIn()}>Cancel</Button>
                        <Button variant="contained" color="primary" onClick={()=>setLoginModal(true)}>LogIn</Button>
                        </div> */}
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
                            {JSON.stringify(currentUser)}
                            {error && <Alert variant="danger">{error}</Alert>}
                            </div>
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
                                Singup
                              </Button>
                              </div>
                            </Form>
                       {/* <div style={{textAlign:'center'}}>
                            <img src={MissionEd_logo} width={'70px'}/>
                            <h3>Welcome To MissionEd-Forum</h3>
                            </div>
                            
                        <div className='form-inputs'>

                        <TextField style={{marginBlock:'5px'}} required={true} id="outlined-basic" onChange={(event)=>console.log(event.target.value)} label="Email" variant="outlined" type='email'/>
                        <TextField style={{marginBlock:'5px'}} required={true} id="outlined-basic" onChange={(event)=>console.log(event.target.value)} label="Password" variant="outlined" type='password'/>
                        <TextField style={{marginBlock:'5px'}} required={true} id="outlined-basic" onChange={(event)=>console.log(event.target.value)} label="Confirm Password" variant="outlined" type='password'/>
                        </div>
                        <div className='form-buttons'>
                        <Button variant="outlined" color="primary" onClick={()=>onCancelSignup()}>Cancel</Button>
                        <Button variant="contained" color="primary" onClick={()=>console.log('sdklk')}>Signup</Button>
                        </div> */}
    
            </Modal>
            <div>

            </div>
         </div>
     );
}

export default Welcome;