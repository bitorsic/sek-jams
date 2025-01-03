const sequelize = require("../config/dbConfig");
const { Tracks, Collaborations } = require("../models");
const { s3Upload } = require("../services/awsService");

const upload = async (artist_id, obj, audio_file) => {
	if (obj.collaboration === "false") obj.collaboration = false;

	if (obj.collaboration && (
		!obj.collaborators || !Array.isArray(obj.collaborators) || obj.collaborators.length === 0
	)) {
		throw new Error(`collaboration is true, but no collaborators provided`);
	}

	// starting an unmanaged transaction
	const t = await sequelize.transaction();

	try {
		const inputObj = {
			artist_id,
			title: obj.title,
			description: obj.description,
			audio: "404",
			length: 0.00, // TODO: calculate audio's length
			genre_id: obj.genre_id,
			release_date: obj.release_date,
			collaboration: obj.collaboration,
		}

		const track = await Tracks.create(inputObj, { transaction: t });

		// uploading audio file
		const s3Url = await s3Upload(
			`audio-tracks/${track.id}`, 
			audio_file,
		);
		track.audio = s3Url;
		await track.save({ transaction: t });

		// creating collaborations if available
		// TODO: test this
		// TODO: add role check for collaborators
		for (let i in obj.collaborators) {
			await Collaborations.create({
				track_id: track.id,
				artist_id: obj.collaborators[i],
			}, { transaction: t });
		}

		await t.commit();
		return track.id;
	} catch (err) {
		await t.rollback();
		throw err;
	}
}

module.exports = {
	upload,
}