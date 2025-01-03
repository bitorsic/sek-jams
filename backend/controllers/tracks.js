const tracks = require("../data-access/tracks");

exports.upload = async (req, res) => {
	try {	
		if (!req.files.audio) {
			return res.status(400).json({ message: "No audio file uploaded" });
		}

		const trackId = await tracks.upload(req.user.id, req.body, req.files.audio[0]);
		
		// uploading cover_art if present

		return res.status(201).json();
	} catch (err) {
		console.error(`Track upload error: ${err}`);
		return res.status(500).json({ message: `Track upload failed: ${err.message}` });
	}
}