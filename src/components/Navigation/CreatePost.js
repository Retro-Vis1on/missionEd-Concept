import React,{useRef, useState} from 'react';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import AddIcon from '@material-ui/icons/Add';
import {Form, Row} from 'react-bootstrap'
import Modal from 'react-modal'
import {db} from './../../firebase'
import Snackbar from '@material-ui/core/Snackbar';
import {useAuth} from './../../contexts/AuthContext'
import MuiAlert from '@material-ui/lab/Alert';
import firebase from 'firebase'
import {UpdateCoins} from './../../apis/API'
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
export default function CreatePost() {
  const{currentUser} = useAuth();
  const [open, setOpen] = React.useState(false);
  const [blankError, setBlankError] = useState(false);
  const[loading,setLoading] = useState(false);
  const titleRef = useRef();
  const tagRef = useRef();
  const descriptionRef = useRef();

  const handleClickOpen = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  };
   async function handlePost(e){
     e.preventDefault();
     if(titleRef.current.value=='' || tagRef.current.value=='' || descriptionRef.current.value==''){
       return setBlankError(true);
     }
     setLoading(true);
     try{
       await db.collection('posts').add({
           user:currentUser.uid,
           title: titleRef.current.value,
           tag: tagRef.current.value,
           description: descriptionRef.current.value,
           timestamp: firebase.firestore.FieldValue.serverTimestamp()    
        })
     }catch{
       alert('something went wront, please check your internet connection!!')
     }
     setLoading(false);
     setOpen(false);
     UpdateCoins(currentUser.uid,20);
   }
   const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setBlankError(false);
  };
  return (
    <div>
      <div className={'post-icon-box'}>
      <AddIcon style={{fontSize:'40px',color:'#E3E3E3'}} onClick={handleClickOpen}/>
      </div>
      <Modal isOpen={open} onRequestClose={()=>handleClose} 
                           style={{
                            content : {
                                borderRadius: '20px',
                                top                   : '55%',
                                left                  : '50%',
                                right                 : 'auto',
                                bottom                : 'auto',
                                marginRight           : '-50%',
                                animationDuration: '1s',
                                transform             : 'translate(-50%, -50%)',
                                backgroundColor:  'white',
                              },
                           }}>
                           <div className={'create-post-modal'}>
                              <h4 className={'text-center'}>Create Post</h4>
                            <Form onSubmit={handlePost}> 
                              <Form.Group controlId="exampleForm.ControlInput1">
                                 <Form.Label >Title</Form.Label>
                                 <Form.Control type="title" placeholder="Title" ref={titleRef} />
                               </Form.Group>
                               <Form.Group controlId="exampleForm.ControlSelect1">
                                  <Form.Label>Category</Form.Label>
                                  <Form.Control as="select" ref={tagRef}>
                                     <option>General</option>
                                     <option>Internship</option>
                                     <option>Question</option>
                                      <option>Experience</option>
                                      </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                      <Form.Label>Description</Form.Label>
                                      <Form.Control className={'textarea-post-modal'} as="textarea" rows={8} ref={descriptionRef}/>
                                    </Form.Group>
                                    <Button variant='outlined' color='primary' onClick={()=>handleClose()}> cancel</Button>
                                    <Button className={'mx-3'} disabled={loading}  variant='contained' color='primary' type='submit'>Post</Button>
                              </Form>            
                           </div>
            </Modal>
            <Snackbar open={blankError} autoHideDuration={2000} onClose={handleCloseError}>
                 <Alert onClose={handleCloseError} severity="info">
                  Post Cann't be blank!!
              </Alert>
            </Snackbar>
    </div>
  );
}
