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

  app.get("/get-signed-url", (req, res) => {
    const fileurls = [];
    params.Key = req.query.fileName;
    s3.getSignedUrl("putObject", params, function(err, url) {
      if (err) {
        console.log("Error getting presigned url from AWS S3");
        res.json({
          success: false,
          message: "Pre-Signed URL error",
          urls: fileurls
        });
      } else {
        fileurls[0] = url;
        console.log("Presigned URL: ", fileurls[0]);
        res.json({
          success: true,
          message: "AWS SDK S3 Pre-signed urls generated successfully.",
          urls: fileurls
        });
      }
    });
  });




app.get('/', (req, res) => res.send('Hello World! '))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))