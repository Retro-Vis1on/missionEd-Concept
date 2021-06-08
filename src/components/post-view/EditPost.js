import React,{useRef, useState} from 'react';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import AddIcon from '@material-ui/icons/Add';
import Linkify from 'react-linkify';
import {Form, Row} from 'react-bootstrap'
import Modal from 'react-modal'
import {db} from './../../firebase'
import Snackbar from '@material-ui/core/Snackbar';
import {useAuth} from './../../contexts/AuthContext'
import MuiAlert from '@material-ui/lab/Alert';
import firebase from 'firebase'
import EditIcon from '@material-ui/icons/Edit';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import JoditEditor from "jodit-react";
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
export default function CreatePost(props) {
  const{currentUser} = useAuth();
  const classes = useStyles();
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
       await db.collection('posts').doc(props.id).update({
           title: titleRef.current.value,
           tag: tagRef.current.value,
           description: descriptionRef.current.value,
           lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
       })
     }catch{
       alert('something went wront, please check your internet connection!!')
     }
     setLoading(false);
     setOpen(false);
   }
   const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setBlankError(false);
  };
  return (
    <div>
      <div >
      <Button
            onClick={()=>handleClickOpen()}
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<EditIcon/>}
        >Edit</Button>
      </div>
      {/* <Modal isOpen={open} onRequestClose={()=>handleClose} 
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
                              <h4 className={'text-center'}>Edit Post</h4>
                            <Form onSubmit={handlePost}> 
                              <Form.Group controlId="exampleForm.ControlInput1">
                                 <Form.Label >Title</Form.Label>
                                 <Form.Control type="title" placeholder="Title" defaultValue={props.post.title} ref={titleRef} />
                               </Form.Group>
                               <Form.Group controlId="exampleForm.ControlSelect1">
                                  <Form.Label>Category</Form.Label>
                                  <Form.Control defaultValue={props.post.tag} as="select" ref={tagRef} >
                                     <option>General</option>
                                     <option>Internship</option>
                                     <option>Question</option>
                                      <option>Experience</option>
                                      </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                      <Form.Label>Description</Form.Label>
                                      <JoditEditor
                                        ref={descriptionRef}
                                        tabIndex={1} 
                                        value={props.post.description}
                                    />
                                      
                                    </Form.Group>
                                    <Button variant='outlined' color='primary' onClick={()=>handleClose()}>Discard</Button>
                                    <Button className={'mx-3'} disabled={loading}  variant='contained' color='primary' type='submit'>Save</Button>
                              </Form>            
                           </div>
            </Modal> */}
            <Dialog fullScreen open={open} TransitionComponent={Transition} disableEnforceFocus={true}>
                  <AppBar className={classes.appBar} style={{backgroundColor:'#444753'}}>
                    <Toolbar>
                      <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                      </IconButton>
                      <Typography variant="h6" className={classes.title}>
                        Edit Post
                      </Typography>
                      {/* <Button variant='outlined' color='primary' disabled={loading} onClick={handlePost}>
                        Post
                      </Button>  */}
                    </Toolbar>
                  </AppBar>
                  <div className={'create-post-modal'}>
                            <Form onSubmit={handlePost}> 
                              <Form.Group controlId="exampleForm.ControlInput1">
                                 <Form.Label style={{fontWeight:'bold'}}>Title</Form.Label>
                                 <Form.Control type="title" placeholder="Title" defaultValue={props.post.title} ref={titleRef} />
                               </Form.Group>
                               <Form.Group controlId="exampleForm.ControlSelect1">
                                  <Form.Label style={{fontWeight:'bold'}}>Category</Form.Label>
                                  <Form.Control as="select" defaultValue={props.post.tag} ref={tagRef}>
                                     <option>General</option>
                                     <option>Internship</option>
                                     <option>Question</option>
                                      <option>Experience</option>
                                      </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                      <Form.Label style={{fontWeight:'bold'}}>Description</Form.Label>
                                      <div >
                                      <JoditEditor
                                        ref={descriptionRef}
                                        tabIndex={1}
                                        value={props.post.description} 
                                        />
                                        </div>
                                    </Form.Group>
                                    <Button variant='outlined' color='primary' onClick={()=>handleClose()}>discard</Button>
                                    <Button className={'mx-3'} disabled={loading}  variant='contained' color='primary' type='submit'>save</Button>
                              </Form>            
                           </div>
                    <Snackbar open={blankError} autoHideDuration={2000} onClose={handleCloseError}>
                        <Alert onClose={handleCloseError} severity="info">
                          Post Cann't be blank!!
                      </Alert>
                    </Snackbar>
                </Dialog>
        
    </div>
  );
}
