const sequelize = require("../config/dbConfig");
const { Tracks, Collaborations } = require("../models");
const users = require("./users");
const { s3Upload } = require("../services/awsService");
const { getAudioLength } = require("../services/ffmpegService");

const upload = async (artist_id, obj, audio_file) => {
	if (obj.collaboration === "false") obj.collaboration = false;

	// firstly parsing the collaborators string to json, if present
	// collaborators should be an array of objects in the format:
	// { "collaborator": artist_id, "role": role_in_collaboration }
	const collaborators = JSON.parse(obj.collaborators);

	if (obj.collaboration && (
		!collaborators || !Array.isArray(collaborators) || collaborators.length === 0
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
			length: await getAudioLength(audio_file), // TODO: calculate audio's length
			genre_id: obj.genre_id,
			release_date: obj.release_date,
			collaboration: obj.collaboration,
		}

		const track = await Tracks.create(inputObj, { transaction: t });
		
		// creating collaborations if available
		if (obj.collaboration) {
			// firstly add the uploader as the 'original artist'
			await Collaborations.create({ 
				track_id: track.id,
				artist_id,
				role_in_collaboration: "original artist"
			}, { transaction: t });

			// then adding the rest as the specified roles
			for (let i in collaborators) {
				// destructure for simplicity
				const { collaborator, role } = collaborators[i];

				if (!await users.isArtist(collaborator)) {
					throw new Error(`Collaborator with id ${collaborator} is not an artist`);
				}

				await Collaborations.create({
					track_id: track.id,
					artist_id: collaborator,
					role_in_collaboration: role,
				}, { transaction: t });
			}
		}
		
		// uploading audio file
		const s3Url = await s3Upload(
			`audio-tracks/${track.id}`, 
			audio_file,
		);
		track.audio = s3Url;
		await track.save({ transaction: t });

		await t.commit();
		return track.id;
	} catch (err) {
		await t.rollback();
		throw err;
	}
};

const updateCoverArt = async (trackId, s3Url) => {
	const track = await Tracks.findByPk(trackId);
	if (!track) throw new Error('Track not found');
	track.cover_art = s3Url;
	await track.save();
};

module.exports = {
	upload,
	updateCoverArt,
}