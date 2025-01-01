exports.upload = async (req, res) => {
	try {
		const {
			title,
			description,
			genre_id,
			release_date,
			collaboration,
			collaborators,
		} = req.body;

		if (!req.files.audio) {
			return res.status(400).json({ message: "No audio file uploaded" });
		}

		

	} catch (err) {
		console.error(`Track upload error: ${err}`);
		return res.status(500).json({ message: `Track upload failed: ${err.message}` });
	}
}