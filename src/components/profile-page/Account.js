import { TextField } from "@material-ui/core";
import {Button} from '@material-ui/core'
import {auth} from './../../firebase'
import {useAuth} from './../../contexts/AuthContext'
import {Form, Alert} from 'react-bootstrap'
import { useRef, useState } from "react";
import firebase from 'firebase'

export default function Account(props) {
    const{currentUser} = useAuth();
    const[currentPassword,setCurrentPasswrod] = useState('');
    const[newPassword, setNewPassword] = useState('');
    const[confirmPassword, setConfirmPassword] = useState('');
    const[msg, setmsg] = useState('');
    async function handleChangePassword(e){
        setmsg('');
        e.preventDefault();
        if(currentPassword.length<8 || newPassword.length<8){
            return setmsg("password cann't be less then 8 character!")
        }
        if(newPassword !== confirmPassword){
            return setmsg("password doesn't match!");
        }
        console.log(auth.currentUser)
         
        try{
            // let a =  firebase.auth.EmailAuthProvider.credential(firebase.auth().currentUser,currentPassword)
            await auth.currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(currentUser.email,currentPassword)).then(()=>{
                auth.currentUser.updatePassword(newPassword).then(()=> {
                    setCurrentPasswrod('');
                    setNewPassword('');
                    setConfirmPassword('');
                   return setmsg('Password Updated successfully')
                  }).catch(function(error) {
                    setmsg('something went wrong!')
                  });
            })
        }
        catch{
            setmsg('wrong password !')
        }
    }
    return(
        <div className={'profile-content'}>
          <Form onSubmit={handleChangePassword}>
          <div className={'profile-update-input'}>
          <h5 style={{textAlign : 'center'}}>Change Password</h5>
          <TextField 
          required
          id="filled-required"
          label="Current Password"
          variant="filled"
          type='password'
          value={currentPassword}
          onChange={(e)=>setCurrentPasswrod(e.target.value)}
          style={{width:'100%', marginTop:'10px'}}
          fullWidth
          />
          </div>
          <div className={'profile-update-input'}>
          <TextField 
          required
          id="filled-required"
          label="New Password"
          variant="filled"
          type='password'
          value={newPassword}
          onChange={(e)=>setNewPassword(e.target.value)}
          style={{width:'100%', marginTop:'10px'}}
          fullWidth
          />
          </div>
          <div className={'profile-update-input'}>
          <TextField 
          required
          id="filled-required"
          label="Confirm New Password"
          variant="filled"
          type={'password'}
          value={confirmPassword}
          onChange={(e)=>setConfirmPassword(e.target.value)}
          style={{width:'100%', marginTop:'10px'}}
          fullWidth
          />
          </div>
          <Button
           type='submit'
           variant="contained"
           color="primary"
           style={{width:'100%',fontWeight:'400',marginTop:'30px'}}
           disabled={false}
           fullWidth
           >
           Update Password
          </Button>
         </Form>
         <div style={{marginTop:'10px'}}>
         {msg && <Alert variant="danger">{msg}</Alert>}
         </div>
          </div>
    );
}