import React, { Component, useState, useEffect, useRef } from "react";
import Resizer from "react-image-file-resizer";
import Default from './../../assets/default.jpg'
import {Form} from 'react-bootstrap'
import EditIcon from '@material-ui/icons/Edit';
import {Button} from '@material-ui/core'
import {useAuth} from './../../contexts/AuthContext'
import {userdb, storage} from './../../firebase'
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import firebase from 'firebase'
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
export default function General(){
  const{currentUser} = useAuth();
  const[newImage,setNewImage] = useState(null);
  const[user, setUser] = useState(null);
  const[loading,setLoading] = useState(false);
  const[imageAsUrl,setImageAsUrl] = useState(null);
  const [blankError, setBlankError] = useState(false);
  const nameRef = useRef();
  const educationRef = useRef();
  const bioRef = useRef();
  const locationRef = useRef();
  useEffect(() => {
    fileChangedHandler = fileChangedHandler.bind(this)
    GetUser();
  }, []);

   async function GetUser(){
     try{
       await userdb.doc(currentUser.uid).onSnapshot(snap=>{
         setUser(snap.data());
       })
     }
     catch{
       console.log('something went wrong')
     }
   }
 

  const handleImage=(e)=>{
    setLoading(true)
    const image = e.target.files[0];

    if(image==="" || image=== undefined){
      setLoading(false);
      alert(`not an image, the file is a  ${typeof image}`)
      return;
    }
    
    fileChangedHandler(image);
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
          100,
          100,
          "JPEG",
          100,
          0,
          (uri) => {
            console.table(uri);
            setNewImage(uri);
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
 async function handleUpdate(){
   setLoading(true);

   if(nameRef.current.value=='' || educationRef.current.value=='' || bioRef.current.value=='' || locationRef.current.value==''){
     setBlankError(true)
     return setLoading(false);
   }
   await UpdateProfile();
    setLoading(false);
 }

 async function UpdateProfile(){
   try{
     await userdb.doc(currentUser.uid).update({
       name: nameRef.current.value,
       education: educationRef.current.value,
       bio: bioRef.current.value,
       location: locationRef.current.value,
       profile_image: imageAsUrl==null ? user.profile_image==null? '': user.profile_image : imageAsUrl,
      })
    }catch{
      console.log('something went wrong !!')
    }
   
 }
  
 async function firebaseUpload(file){

  
  const uploadTask = storage.ref(`/profile_images/${file.name}`).put(file)
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
    storage.ref('profile_images').child(file.name).getDownloadURL()
     .then(fireBaseUrl => {
         setImageAsUrl(fireBaseUrl);
         setLoading(false);
        })
      })
}

   const handleCloseError = (event, reason) => {
     if (reason === 'clickaway') {
      return;
    }
    setBlankError(false);
   };
 
    return (
      <div>
        {user==null ? <div className={'general-section'}></div>
        :
      <div className={'general-section'}>
        <text style={{textAlign:'center',marginBottom : '8px'}}>Profile Picture</text>
         <label style={{display : 'flex',justifyContent : 'center',width:'fit-content',borderRadius:'50%',alignSelf:'center'}} htmlFor="file">
            <div>
            <div className={'picture-edit'}>
            <EditIcon/>
            </div>
            <img src={user.profile_image=='' ? Default : (newImage==null ? user.profile_image==null? Default : user.profile_image : URL.createObjectURL(newImage))}/>
            </div>
          </label>
        <input id="file" style={{display:'none'}} name={'image'} type="file" onChange={(e)=>handleImage(e)} accept={'image/jpg , image/png, image/jpeg'} width="48" height="48"/>  
        <text style={{marginBottom : '8px'}}>Name</text>
        <Form.Control ref={nameRef} type="name" defaultValue={user.name} placeholder="name" style={{width:'100%'}}/>
        <text style={{marginBottom : '8px'}}>Education</text>
        <Form.Control type="education" ref={educationRef} defaultValue={user.education} placeholder="education" style={{width:'100%'}}/>
        <text style={{marginBottom : '8px'}}>Bio</text>
        <Form.Control as="textarea" ref={bioRef} rows={3} defaultValue={user.bio} style={{maxWidth:'400px',resize:'none'}} style={{width:'100%'}}/>
        <text style={{marginBottom : '8px'}}>Location</text>
        <Form.Control type="location" ref={locationRef} defaultValue={user.location} placeholder="location" style={{width:'100%'}}/>
        <Button
        variant="contained"
        color="default"
        style={{width:'fit-content',fontWeight:'600',margin : '30px auto 10px auto'}}
        disabled={loading}
        onClick={()=>handleUpdate()}
       >
        Update Profile
      </Button>
      </div>
      }
      <Snackbar open={blankError} autoHideDuration={2000} onClose={handleCloseError}>
                 <Alert onClose={handleCloseError} severity="info">
                  Please fill all details to update your profile!
              </Alert>
            </Snackbar>
      </div>
    );
  
}

