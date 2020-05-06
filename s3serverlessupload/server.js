const express = require('express')
const dotenv = require('dotenv').config()

const app = express()
const port = 3001

const id= process.env.ACCESS_ID

const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_ID, // aws access id here
  secretAccessKey: process.env.ACCESS_SECRET, // aws secret access key here
  useAccelerateEndpoint: true,
  region: 'us-east-2'
});

let params = {
    Bucket: "myserverlessupload",
    Key: "my.jpg",
    Expires: 60, // expiry time
    ACL: "bucket-owner-full-control",
    ContentType: "image/jpeg"
  };

  app.get("/get-signed-url", async (req, res) => {
    let fileurls = [];
    const files = Array.from(req.query.files)
    let success = null;
    let message = null;
    console.log(files)
    await files.forEach(file=>{
        params.Key = file;
        const result =  s3.getSignedUrl("putObject", params, function(err, url) {
            if (err) {
                console.log("Error getting presigned url from AWS S3");
                success = false;
                message = "Pre-Signed URL error"
            } else {
                success = true;
                message = "AWS SDK S3 Pre-signed urls generated successfully.";
                fileurls.push(url)
            }
            });
    })
    res.send({
        success: success,
        message: message,
        urls: fileurls
    });
  });


app.get('/', (req, res) => res.send('Hello World! '))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))