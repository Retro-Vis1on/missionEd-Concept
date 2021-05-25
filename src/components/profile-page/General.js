import React, { Component } from "react";
import Resizer from "react-image-file-resizer";
import Default from './../../assets/default.jpg'
import {Form} from 'react-bootstrap'
import EditIcon from '@material-ui/icons/Edit';
import {Button} from '@material-ui/core'
class ImageResizer extends Component {
  constructor(props) {
    super(props);
    this.fileChangedHandler = this.fileChangedHandler.bind(this);
    this.state = {
      newImage: null,
    };
  }

  fileChangedHandler(event) {
    var fileInput = false;
    if (event.target.files[0]) {
      fileInput = true;
    }
    if (fileInput) {
      try {
        Resizer.imageFileResizer(
          event.target.files[0],
          100,
          100,
          "JPEG",
          100,
          0,
          (uri) => {
            console.table(uri);
            this.setState({ newImage: uri });
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

  render() {
    return (
      <div className={'general-section'}>
        {/* {this.state.newImage==''?
        null:
        <img src={this.state.newImage}/>
         }
        <input type="file" onChange={this.fileChangedHandler} />
        <img src={this.state.newImage} alt="" /> */}
        <text>Profile Picture</text>
        <div>
        <div className={'picture-edit'}>
        <EditIcon/>
        </div>
        <img src={Default}/>
        </div>
        <text>Name</text>
        <Form.Control type="name" placeholder="name" style={{maxWidth:'400px'}}/>
        <text>Education</text>
        <Form.Control type="education" placeholder="education" style={{maxWidth:'400px'}}/>
        <text>Bio</text>
        <Form.Control as="textarea" rows={3}  style={{maxWidth:'400px',resize:'none'}}/>
        <text>Location</text>
        <Form.Control type="location" placeholder="Jaipur" style={{maxWidth:'400px'}}/>
        <Button
        variant="contained"
        color="default"
        style={{width:'fit-content',fontWeight:'600',marginTop:'30px'}}
        disabled={false}
       >
        Update Profile
      </Button>
      </div>
    );
  }
}

export default ImageResizer;