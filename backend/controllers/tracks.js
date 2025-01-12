const tracks = require("../data-access/tracks");
const { s3Upload, s3Download } = require("../services/awsService");

exports.upload = async (req, res) => {
	try {	
		if (!req.files.audio) {
			return res.status(400).json({ message: "No audio file uploaded" });
		}

		const trackId = await tracks.upload(req.user.id, req.body, req.files.audio[0]);
		
		// uploading cover_art if present
		if (req.files?.cover_art) {
			const s3Url = await s3Upload(
				`public/cover-art/track-${trackId}`, 
				req.files.cover_art[0], // as the key has array instead of single file
			);
      		await tracks.updateCoverArt(trackId, s3Url);
		}

		return res.status(201).json();
	} catch (err) {
		console.error(`Track upload error: ${err}`);
		return res.status(500).json({ message: `Track upload failed: ${err.message}` });
	}
};

exports.fetch = async (req, res) => {
	try {
		const range = req.query.range;

		const getResponse = await s3Download(`audio-tracks/${req.params.trackId}`, range);
		
		// setting header
		res.status(200).set({
			'Content-Type': getResponse.ContentType,
			'Content-Length': getResponse.ContentLength,
		});

		getResponse.Body.pipe(res);
	} catch (err) {
		if (err.name === "NotFound") {
			return res.status(404).json({ message: `Track with id ${req.params.trackId} not found` });
		}

		console.error(`Track fetch error: ${err}`);
		return res.status(500).json({ message: `Track fetch failed: ${err.message}` });
	}
}