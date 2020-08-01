const AWS = require('aws-sdk');

const S3 = new AWS.S3({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  Bucket: process.env.BUCKET,
});

module.exports = S3;
