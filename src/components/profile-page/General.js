import React, { Component } from "react";
import Resizer from "react-image-file-resizer";

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
      <div className="App">
        {this.state.newImage==''?
        null:
        <img src={this.state.newImage}/>
         }
        <input type="file" onChange={this.fileChangedHandler} />
        <img src={this.state.newImage} alt="" />
        
      </div>
    );
  }
}

export default ImageResizer;