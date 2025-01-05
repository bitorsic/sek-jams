const validator = {
	image: {
		allowedTypes: /image\/(jpeg|jpg|png|gif|bmp|webp)/,
		maxSize: 5 * 1024 * 1024, // 5mb
	},
	audio: {
		allowedTypes: /audio\/(mpeg|mp3|wav|flac|ogg|aac)/,
		maxSize: 50 * 1024 * 1024, // 50mb
	}
}

// the rules should be an object with the format:
// rules = {
// 	fieldName: fileFormat // 'image' or 'audio'
// }
const uploadValidate = (rules) => {
	return (req, res, next) => {
		try {
			if (!req.files) {
				return next();
			}

			const errors = [];
			Object.values(req.files).forEach((file) => {
				file = file[0] // because each entry is an array in itself
				
				const fileType = rules[file.fieldname];
				if (!fileType) {
					errors.push(`Unexpected file field: ${file.fieldname}`);
					return;
				}

				// validating file type
				if (!validator[fileType] || !validator[fileType].allowedTypes.test(file.mimetype)) {
					errors.push(`Invalid file type ${file.mimetype} for field ${file.fieldname}`);
				}

				// validating file size
				if (file.size > validator[fileType].maxSize) {
					errors.push(
						`File for field ${file.fieldname} exceeds maximum size of ${
							validator[fileType].maxSize / 1024 / 1024
						} MB`
					);
				}
			});

			if (errors.length > 0) {
				return res.status(400).json({ message: `Upload validation failed: ${errors}` });
			}

			next();
		} catch (err) {
			console.error(`Upload validation error: ${err}`);
			res.status(500).json({ message: `Upload validation failed: ${err.message}` });
		}
	};
};

module.exports = uploadValidate;
