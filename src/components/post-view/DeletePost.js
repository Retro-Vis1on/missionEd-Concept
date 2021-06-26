import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import {Button} from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { db } from '../../firebase';
import {Link} from 'react-router-dom'
import firebase from 'firebase';

export default function DeletePost(props) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
    async function Delete(){
       try{
           await db.collection('posts').doc(props.id).delete();
           db.collection('counts').doc('all').update({
               all: firebase.firestore.FieldValue.increment(-1)
           })
       }catch{
           console.log('something went wrong!')
       }
    }
    return (
        <div>
            <Button
               onClick={handleClickOpen}
               variant="outlined"
                color="primary"
                size="small"
                startIcon={<DeleteIcon/>}
            >Delete</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Do you really want to delete this post ?</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                The post will permanently remove after delete, do you still want to delete!
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button 
                  onClick={handleClose} 
                  color="primary"
                  variant='outlined'>
                    cancel
                </Button>
                <Link to='/' style={{textDecorationLine:'none'}}>
                <Button 
                  onClick={()=>Delete()} 
                  color="primary" 
                  variant='contained'
                  autoFocus>
                    Yes
                </Button>
                </Link>
                </DialogActions>
            </Dialog>
        </div>
    )
}
