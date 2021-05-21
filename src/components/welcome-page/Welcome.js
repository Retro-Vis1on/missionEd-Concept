import React,{useState,useEffect} from 'react'
import './Welcome.css'
import {Button,TextField} from '@material-ui/core'
import Modal from 'react-modal'
import MissionEd_logo from './../../assets/MissionEd_logo.svg'
import {Form} from 'react-bootstrap'
const Welcome = () =>{
     const[loginModal,setLoginModal] = useState(false);
     const[signUpModal, setSignupModal] = useState(false);
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
                              <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" />
                              </Form.Group>
                              <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" />
                              </Form.Group>
                              <div className='form-buttons'>
                              <Button variant="outlined" color="primary" onClick={()=>onCancelLogIn()}>Cancel</Button>
                              <Button onClick={()=>console.log('skdlfj')} variant="contained" color="primary" type="submit">
                                Submit
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
                         <Form>
                            <div style={{textAlign:'center'}}>
                            <img src={MissionEd_logo} width={'70px'}/>
                            <h3>Welcome To MissionEd-Forum</h3>
                            </div>
                              <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" />
                              </Form.Group>
                              <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" />
                              </Form.Group>
                              <Form.Group controlId="formBasicPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" />
                              </Form.Group>
                              <div className='form-buttons'>
                              <Button variant="outlined" color="primary"  onClick={()=>onCancelSignup()}>Cancel</Button>
                              <Button onClick={()=>console.log('skdlfj')} variant="contained" color="primary" type="submit">
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