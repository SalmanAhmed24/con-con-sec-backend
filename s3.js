// const dotenv = require("dotenv");
// dotenv.config();
// const fs = require("fs");
// const {
//   S3Client,
//   PutObjectCommand,
//   GetObjectCommand,
// } = require("@aws-sdk/client-s3");

// const bucketName = process.env.AWS_BUCKET_NAME;
// const bucketRegion = process.env.AWS_BUCKET_REGION;
// const accessKey = process.env.AWS_ACCESS_KEY;
// const secretKey = process.env.AWS_SECRET_KEY;
// const s3 = new S3Client({
//   credentials: {
//     accessKeyId: accessKey,
//     secretAccessKey: secretKey,
//   },
//   region: bucketRegion,
// });

// function uploadFile(file) {
//   console.log("this is yeah file", file);
//   const uploadParams = {
//     Bucket: bucketName,
//     Body: file.buffer,
//     Key: file.originalname,
//     ContentType: file.mimetype,
//   };
//   const command = new PutObjectCommand(uploadParams);
//   s3.send(command)
//     .then((res) => {
//       console.log(res.ETag);
//     })
//     .catch((err) => console.log(err));
// }
// function getFile() {
//   const uploadParams = {
//     Bucket: bucketName,
//     Key: "about-header.png",
//   };
//   const command = new GetObjectCommand(uploadParams);
//   s3.send(command)
//     .then((res) => {
//       console.log(res);
//     })
//     .catch((err) => console.log(err));
// }
// exports.getFile = getFile;
// exports.uploadFile = uploadFile;
