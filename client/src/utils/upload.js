import axios from 'axios'
const AWS = require('aws-sdk')
const config = {
  secretAccessKey: 'aHOzpUp3nCoHyYL3rGRsejyjNPC94psK1nvUcgat',
  accessKeyId: 'AKIA3JPVUL47F5NR5XMG',
  region: 'ap-south-1',
}
AWS.config = config
const s3bucket = new AWS.S3()
var bucketName = 'social-app-assets'

export const upload = (file, cb = () => {}) => {
  try {
    const fileName = `${file?.name}-${new Date().getTime()}`
    var params = {
      Bucket: bucketName,
      Key: fileName,
      Expires: 90000,
      ContentType: file.type,
      ACL: 'public-read',
    }
    s3bucket.getSignedUrl('putObject', params, function (err, data) {
      if (err) {
        return cb(err)
      }
      var options = {
        headers: {
          'Content-Type': file.type,
        },
      }
      // const url = `https://s3.ap-south-1.amazonaws.com/${bucketName}/${fileName}`
      const url = `${
        process.env.CLOUDFRONT_ASSETS_URL ||
        'https://d225jocw4xhwve.cloudfront.net'
      }/${fileName}`
      axios
        .put(data, file, options)
        .then(() => cb(false, url))
        .catch((err) => cb(err))
    })
  } catch (error) {
    console.log({ error })
  }
}
