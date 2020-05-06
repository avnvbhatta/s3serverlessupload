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
          for(let i=0; i<data.data.urls.length; i++){
              axios
                .put(data.data.urls[i], this.state.selectedFile[i], config)
                .then(res => console.log("Upload Completed", res))
                .catch(err => console.log("Upload Interrupted", err));
          }
      });


    }

    render(){
      return(
        <div>
            <input type="file" multiple onChange={this.fileChangedHandler} />
            <button onClick={this.uploadHandler}>Upload!</button>
        </div>
    )
    }
    
}

const getSignedURL = (files) => {
    let myFiles = []
    let myarray = Array.from(files)
    myarray.map(item=>{myFiles.push(item.name)})
    return new Promise((resolve, reject) => {
      axios
        .get("http://localhost:3001/get-signed-url", 
            {
              params: {
                files: myFiles
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