// require("dotenv").config();
const fs = require("fs");
const { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');

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
	const fileStream = fs.createReadStream(file.path);

	const params = {
		Bucket: process.env.AWS_S3_BUCKET_NAME,
		Key: filename,
		Body: fileStream,
		ContentType: file.mimetype,
	};

	const command = new PutObjectCommand(params);
	await s3.send(command);
	fs.unlinkSync(file.path); // deleting the file after upload

	return `https://${process.env.AWS_S3_BUCKET_NAME}.${process.env.AWS_S3_ENDPOINT}/${filename}`;
};

// returns { ContentType, ContentLength, Body }
// the Body cannot be included in JSON response, use .pipe() on it
// the range is an array where [startByte, endByte]
const s3Download = async (filename, range) => {
	const params = {
		Bucket: process.env.AWS_S3_BUCKET_NAME,
		Key: filename,
	};

	// this is here to verify if the file exists
	// it throws an error with err.name === "NotFound" if the file doesn't already exist
	let command = new HeadObjectCommand(params);
	const headResponse = await s3.send(command);

	// checking if the range provided is within the file size
	if (
		range[0] >= headResponse.ContentLength || 
		range[1] >= headResponse.ContentLength || 
		range[1] < range[0]
	) {
		throw new Error(`Requested range not satisfiable`);
	}

	// if end was NaN, it refers to the last byte of the file
	if (Number.isNaN(range[1])) { range[1] = headResponse.ContentLength - 1 }

	// construct the range string
	range = `bytes=${range[0]}-${range[1]}`;
	
	// dynamically add range to params
	if (range) { params.Range = range }

	command = new GetObjectCommand(params);
	const { ContentType, ContentLength, Body } = await s3.send(command);
	
	return { ContentType, ContentLength, Body };
}

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

// // Uncomment to delete user's profile picture
// (async (user_id) => { await s3Delete(`public/profile-pictures/${user_id}`); console.log(`profile picture deleted for user id ${user_id}`);})(1);

// // Uncomment to delete audio track
// (async (track_id) => { await s3Delete(`audio-tracks/${track_id}`); console.log(`audio track deleted for track id ${track_id}`)})(1);

// // Uncomment to delete track's cover art
// (async (track_id) => { await s3Delete(`public/cover-art/track-${track_id}`); console.log(`cover art deleted for track id ${track_id}`);})(1);

module.exports = {
	s3Upload,
	s3Delete,
	s3Download,
}
