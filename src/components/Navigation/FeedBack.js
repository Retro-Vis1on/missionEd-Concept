import React,{useState} from 'react'
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
import {Button,TextField} from '@material-ui/core'
import { useMediaQuery } from 'react-responsive'

export default function FeedBack() {

    const[feedback, setfeedback] = useState(false);
    const [value, setValue] = React.useState(2);
    const [hover, setHover] = React.useState(-1);
    const feedbackClose = () => {
        setfeedback(false);
      };

      const isMobile = useMediaQuery(
        { minDeviceWidth:'768px' },
        // `device` prop
     )

    return (
        <div>
            <Tooltip title="Feedback">
            <div style={{position:'fixed',right:'3%',bottom:'5%'}}>
            <Fab onClick={()=>{setfeedback(true)}} color="primary" aria-label="add">
               <FeedbackIcon />
            </Fab>
            </div>
            </Tooltip>
            <div>
              <Dialog
                open={feedback}
                keepMounted
                onClose={feedbackClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
              >
                <DialogTitle id="alert-dialog-slide-title">{"FeedBack"}</DialogTitle>
                <DialogContent>
                  <div style={{display:'flex',flexDirection:'column',minWidth: !isMobile ? '250px' : '400px'}}>
                  <TextField  label="What do like most?" />
                  <TextField className='my-3' label="not liked ?" />
                  </div>
                  <div style={{display:'flex'}}>
                  <Rating
                      name="hover-feedback"
                      value={value}
                      precision={0.5}
                      onChange={(event, newValue) => {
                        setValue(newValue);
                      }}
                      onChangeActive={(event, newHover) => {
                        setHover(newHover);
                      }}
                      size='large'
                      />
                    {value !== null && <Box style={{alignSelf:'center'}} ml={2}>{labels[hover !== -1 ? hover : value]}</Box>}              
                  </div>
                  <TextField className='my-3' label="Description" multiline fullWidth/>
                </DialogContent>
                  <Button style={{marginBlock:'8px',marginInline:'20px'}} onClick={feedbackClose} variant='contained' color="primary">
                    Submit
                  </Button>
              </Dialog>
        </div>
        </div>
    )
}
const labels = {
    0.5: 'Useless',
    1: 'Useless+',
    1.5: 'Poor',
    2: 'Poor+',
    2.5: 'Ok',
    3: 'Ok+',
    3.5: 'Good',
    4: 'Good+',
    4.5: 'Excellent',
    5: 'Excellent+',
  };