import { TextField } from "@material-ui/core";
import {Button} from '@material-ui/core'

export default function Account(props) {
    return(
        <div className={'profile-content'}>
          <div className={'profile-update-input'}>
          <h5>Change Password</h5>
          <TextField 
          required
          id="filled-required"
          label="Current Password"
          variant="filled"
          type='password'
          style={{maxWidth:'500px', marginTop:'10px'}}
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
          style={{maxWidth:'500px', marginTop:'10px'}}
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
          style={{maxWidth:'500px', marginTop:'10px'}}
          fullWidth
          />
          </div>
          <Button
           variant="contained"
           color="primary"
           style={{maxWidth:'500px',fontWeight:'400',marginTop:'30px'}}
           disabled={false}
           fullWidth
           >
           Update Password
          </Button>
          </div>
    );
}