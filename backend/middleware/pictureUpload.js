const multer = require('multer');

// allowing only pictures
const fileFilter = (req, file, cb) => {
	const allowedExtensions = /jpeg|jpg|png/;
	const extname = allowedExtensions.test(file.mimetype);

	if (extname) {
		cb(null, true);
	} else {
		cb(new Error('Only .jpg, .jpeg, and .png files are allowed!'), false);
	}
};

const storage = multer.memoryStorage();
const upload = multer({
	storage,
	fileFilter,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5mb
});

module.exports = upload;