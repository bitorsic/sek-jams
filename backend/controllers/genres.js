const genres = require("../data-access/genres");

exports.create = async (req, res) => {
	try {
		await genres.create(req.body.genreName);

		return res.status(201).json();
	} catch (err) {
		console.error(`Genre creation error: ${err}`);
		return res.status(500).json({ message: `Genre creation failed: ${err.message}` });
	}
}