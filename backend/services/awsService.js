// require("dotenv").config();
const { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
	region: "ap-south-1",
});

// takes in the filename as URL string, and the file
// returns the URL of uploaded file on S3 if successful
const s3Upload = async (filename, file) => {
	const params = {
		Bucket: process.env.AWS_S3_BUCKET_NAME,
		Key: filename,
		Body: file.buffer,
		ContentType: file.mimetype,
	};

	const command = new PutObjectCommand(params);
	await s3.send(command);

	return `https://${process.env.AWS_S3_BUCKET_NAME}.${process.env.AWS_S3_ENDPOINT}/${filename}`;
};

// takes in the filename of file to be deleted
const s3Delete = async (filename) => {
	const params = {
		Bucket: process.env.AWS_S3_BUCKET_NAME,
		Key: filename,
	};

	// this is here to verify if the file exists
	// it throws an error with err.name === "NotFound" if the file doesn't already exist
	let command = new HeadObjectCommand(params);
	await s3.send(command);

	command = new DeleteObjectCommand(params);
	await s3.send(command);
}

// (async () => { await s3Delete(`public/profile-pictures/24`) })()

module.exports = {
	s3Upload,
	s3Delete,
}
