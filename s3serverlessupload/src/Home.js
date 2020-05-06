import React from "react"
import axios from "axios"



class Home extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      selectedFile: null
    }
  }

    fileChangedHandler = (event) => {      
      this.setState({ selectedFile: event.target.files })
    }

    uploadHandler = () => {
      const config = {
        onUploadProgress: function(progressEvent) {
          var percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(percentCompleted);
        }
      };

      

      getSignedURL(this.state.selectedFile).then(data => {
        axios
          .put(data.data.urls[0], this.state.selectedFile[0], config)
          .then(res => console.log("Upload Completed", res))
          .catch(err => console.log("Upload Interrupted", err));
      });


    }

    render(){
      return(
        <div>
            <input type="file" onChange={this.fileChangedHandler} />
            <button onClick={this.uploadHandler}>Upload!</button>
        </div>
    )
    }
    
}

const getSignedURL = (file) => {
    console.log()
    let fileName = file[0].name;
    return new Promise((resolve, reject) => {
      axios
        .get("http://localhost:3001/get-signed-url", 
            {
              params: {
                fileName: fileName
              }
            }
        )
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  };

export default Home