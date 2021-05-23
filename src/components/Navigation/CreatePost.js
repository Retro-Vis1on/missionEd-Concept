import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import AddIcon from '@material-ui/icons/Add';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreatePost() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <AddIcon style={{fontSize:40}} onClick={handleClickOpen}/>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
          <div style={{width:'600px'}}>

        <div>
                        <text style={{textAlign:'center',fontSize:'20px'}}>Create Topic</text>
                        <hr></hr>
                        <div className={'input-uper-box'}>

                        <input className={'input-title'} required={true} maxLength={50} placeholder={"Title"}/>

                        </div>
                        <text style={{color:'red',fontSize:'12px',marginLeft:'40%'}}> error</text>
                        <div style={{display:'flex',justifyContent:'center'}}>
                        <textarea className={'input-discription'} name="text" placeholder="Enter text"></textarea>
                        </div>
                        
                        <div className={'create-post-buttons-box'}>
                        <text className={'create-post-button'} onClick={()=>handleClose()}>Cancel</text>
                        <text className={'create-post-button'}   >Create Topic</text>
                        </div>
                    </div>
          </div>
      </Dialog>
    </div>
  );
}
