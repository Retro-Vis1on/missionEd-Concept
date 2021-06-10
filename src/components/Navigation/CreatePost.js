import React,{useRef, useState, useEffect} from 'react';
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
import JoditEditor from "jodit-react";
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import ImageIcon from '@material-ui/icons/Image';
import VideocamIcon from '@material-ui/icons/Videocam';
import Resizer from "react-image-file-resizer";
import { ControlPointSharp } from '@material-ui/icons';
import {userdb, storage} from './../../firebase'
import LinearProgress from '@material-ui/core/LinearProgress';

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
export default function CreatePost() {
  const{currentUser} = useAuth();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [blankError, setBlankError] = useState(false);
  const[loading,setLoading] = useState(false);
  const[content,setContent] = useState('');
  const[videoLoading, setvideoLoading] = useState(false);
  const titleRef = useRef();
  const tagRef = useRef();
  const descriptionRef = useRef();

  useEffect(() => {
    fileChangedHandler = fileChangedHandler.bind(this)
  }, []);
  
  const handleClickOpen = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setContent('');
    setLoading(false);
    setvideoLoading(false);

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
     setContent('');
     setOpen(false);
     UpdateCoins(currentUser.uid,10);
   }
   const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setBlankError(false);
  };

  const handleImage=(e)=>{
    setLoading(true);
    const image = e.target.files[0];
    if(image==="" || image=== undefined){
      setLoading(false);
      console.log('asdklfjlasdjklfjaskldjflkjl')
      alert(`not an image, the file is a  ${typeof image}`)
      return;
    }
    let extension = image.name.split('.').pop();
    if(extension==='png' || extension==='jpg' || extension==='jpeg')
     {
      return fileChangedHandler(image);
     }
     setLoading(false);
  }

  const handleVideo=(e)=>{
    setvideoLoading(true);
    const video = e.target.files[0];
    if(video==='' || video=== undefined || video.name.split('.').pop()!=='mp4'){
      setvideoLoading(false);
      alert(`not a video, the file is a ${typeof video}`);
      return;
    }
    // let extension = video.name.split('.').pop();
    fileVideoUpload(video)
  }

  async function fileChangedHandler(image) {
    var fileInput = false;
    if (image) {
      fileInput = true;
    }
    if (fileInput) {
      try {
        Resizer.imageFileResizer(
          image,
          500,
          500,
          "JPEG",
          100,
          0,
          (uri) => {
            console.table(uri);
            firebaseUpload(uri);
          },
          "file",
          200,
          200
        );
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function firebaseUpload(file){

  
    const uploadTask = storage.ref(`/post_images/${file.name}`).put(file)
    //initiates the firebase side uploading 
    uploadTask.on('state_changed', 
    (snapShot) => {
      //takes a snap shot of the process as it is happening
    }, (err) => {
      //catches the errors
      console.log(err)
    }, () => {
      // gets the functions from storage refences the image storage in firebase by the children
      // gets the download url then sets the image from firebase as the value for the imgUrl key:
      storage.ref('post_images').child(file.name).getDownloadURL()
       .then(fireBaseUrl => {
           setContent(descriptionRef.current.value + `<img src="${fireBaseUrl}" alt="" style="width: 300px;"></img>`)
           setLoading(false);
          })
        })
  }
{/* <iframe width="400px" height="345px" src="https://media.istockphoto.com/videos/massive-school-of-black-cod-fish-or-smallscaled-cod-swim-underwater-video-id1134262765" frameborder="0" allowfullscreen=""><br></iframe> */}
async function fileVideoUpload(file){

  
  const uploadTask = storage.ref(`/post_videos/${file.name}`).put(file)
  //initiates the firebase side uploading 
  uploadTask.on('state_changed', 
  (snapShot) => {
    //takes a snap shot of the process as it is happening
  }, (err) => {
    //catches the errors
    console.log(err)
  }, () => {
    // gets the functions from storage refences the image storage in firebase by the children
    // gets the download url then sets the image from firebase as the value for the imgUrl key:
    storage.ref('post_videos').child(file.name).getDownloadURL()
     .then(fireBaseUrl => {
         setContent(descriptionRef.current.value + `<iframe width="400px" height="345px" src="${fireBaseUrl}" frameborder="0" allowfullscreen=""><br></iframe>`)
         setvideoLoading(false);
        })
      })
}




  return (
    <div>
      <div className={'post-icon-box'}>
      <AddIcon style={{fontSize:'40px',color:'#E3E3E3'}} onClick={(e)=>handleClickOpen(e)}/>
      </div>
               <Dialog fullScreen open={open} TransitionComponent={Transition} disableEnforceFocus={true}>
                  <AppBar className={classes.appBar} style={{backgroundColor:'#444753'}}>
                    <Toolbar>
                      <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                      </IconButton>
                      <Typography variant="h6" className={classes.title}>
                        Create Post
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
                                 <Form.Control type="title" placeholder="Title" ref={titleRef} />
                               </Form.Group>
                               <Form.Group controlId="exampleForm.ControlSelect1">
                                  <Form.Label style={{fontWeight:'bold'}}>Category</Form.Label>
                                  <Form.Control as="select" ref={tagRef}>
                                     <option>General</option>
                                     <option>Internship</option>
                                     <option>Question</option>
                                      <option>Placement</option>
                                      </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                      <Form.Label style={{fontWeight:'bold'}}>Description</Form.Label>
                                    <div>
                                      <JoditEditor
                                        ref={descriptionRef}
                                        tabIndex={1}
                                        config={{enableDragAndDropFileToEditor: true, statusbar:'blue', toolbarSticky:true}} 
                                        value={content}
                                        />
                                        </div>
                                        <div style={{marginTop:'10px'}}>
                                          <label htmlFor='image-file'>
                                            <div  
                                             style={{
                                               border: 'solid 0.1px',
                                               fontSize:'12px',
                                               paddingInline:'4px',
                                               marginRight:'10px',
                                               borderRadius:'5px',
                                              }}
                                              >
                                             {loading && <LinearProgress color="secondary" />} 
                                            <ImageIcon/>Upload Image
                                            </div>
                                            </label>
                                            <input id="image-file" disabled={loading || videoLoading} style={{display:'none'}} name={'image'} type="file" onChange={(e)=>handleImage(e)} accept={'image/jpg , image/png, image/jpeg'}/>
                                        <label htmlFor='video-file'>
                                            <div 
                                             style={{
                                               border: 'solid 0.1px',
                                               fontSize:'12px',
                                               paddingInline:'4px',
                                               marginRight:'10px',
                                               borderRadius:'5px',
                                             }}
                                             >
                                            {videoLoading && <LinearProgress color="secondary" />}
                                            <VideocamIcon/>Upload Video
                                            </div>
                                            <input id="video-file" style={{display:'none'}} disabled={loading || videoLoading} name={'video'} type="file" onChange={(e)=>handleVideo(e)} accept={'video/mp4 , video/gif'}/>
                                            </label>
                                          </div>
                                    </Form.Group>
                                    <div style={{marginTop:'30px'}}>
                                    <Button variant='outlined' color='primary' onClick={()=>handleClose()}> cancel</Button>
                                    <Button className={'mx-3'} disabled={loading || videoLoading}  variant='contained' color='primary' type='submit'>Post</Button>
                                    </div>
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
