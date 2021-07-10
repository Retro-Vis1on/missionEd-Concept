import React, { useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import { Form } from 'react-bootstrap'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import firebase from 'firebase'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import JoditEditor from "jodit-react";
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Layout from '../layout/Layout'
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
  const classes = useStyles();
  const [blankError, setBlankError] = useState(false);
  const titleRef = useRef();
  const tagRef = useRef();
  const descriptionRef = useRef();
  async function handlePost(e) {
    e.preventDefault();
    if (titleRef.current.value === '' || tagRef.current.value === '' || descriptionRef.current.value === '') {
      return setBlankError(true);
    }
    const data = {
      title: titleRef.current.value,
      tag: tagRef.current.value,
      description: descriptionRef.current.value,
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    }
    props.editHandler(data)
  }
  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setBlankError(false);
  };
  return (
    <Dialog fullScreen open={props.isOpen} TransitionComponent={Transition} disableEnforceFocus={true}>
      <AppBar className={classes.appBar} style={{ backgroundColor: '#444753' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={props.onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Edit Post
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={'create-post-modal'}>
        <Layout>
          <Form onSubmit={handlePost}>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label style={{ fontWeight: 'bold' }}>Title</Form.Label>
              <Form.Control type="title" placeholder="Title" defaultValue={props.post.title} ref={titleRef} />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label style={{ fontWeight: 'bold' }}>Category</Form.Label>
              <Form.Control as="select" defaultValue={props.post.tag} ref={tagRef}>
                <option>General</option>
                <option>Internship</option>
                <option>Question</option>
                <option>Placement</option>
                <option>Project</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label style={{ fontWeight: 'bold' }}>Description</Form.Label>
              <div >
                <JoditEditor
                  ref={descriptionRef}
                  tabIndex={1}
                  value={props.post.description}
                />
              </div>
            </Form.Group>
            <Button variant='outlined' color='primary' onClick={props.onClose}>Discard</Button>
            <Button className={'mx-3'} disabled={props.isLoading} variant='contained' color='primary' type='submit'>save</Button>
          </Form>
        </Layout>
      </div>
      <Snackbar open={blankError} autoHideDuration={2000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="info">
          Post Can't be blank!!
        </Alert>
      </Snackbar>

    </Dialog>
  );
}
