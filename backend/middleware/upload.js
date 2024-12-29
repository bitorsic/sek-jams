const multer = require('multer');

// allowing only pictures and audios
const fileFilter = (req, file, cb) => {
	const allowedExtensions = /jpeg|jpg|png|mp3|wav|flac/;
	const extname = allowedExtensions.test(file.mimetype);

	if (extname) {
		cb(null, true);
	} else {
		cb(new Error('Allowed file formats: jpeg, jpg, png, mp3, wav, flac'), false);
	}
};

const storage = multer.memoryStorage();
const upload = multer({
	storage,
	fileFilter,
	limits: { fileSize: 50 * 1024 * 1024 }, // 50mb
});

module.exports = upload;