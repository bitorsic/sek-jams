const sequelize = require("../config/dbConfig");
const { Tracks, Collaborations, Users, Genres } = require("../models");
const users = require("./users");
const { s3Upload } = require("../services/awsService");
const { getAudioLength } = require("../services/ffmpegService");

const upload = async (artist_id, obj, audio_file) => {
	if (obj.collaboration === "false") obj.collaboration = false;

	
	// starting an unmanaged transaction
	const t = await sequelize.transaction();
	
	try {
		const inputObj = {
			artist_id,
			title: obj.title,
			description: obj.description,
			audio: "404",
			length: await getAudioLength(audio_file),
			genre_id: obj.genre_id,
			release_date: obj.release_date,
			collaboration: obj.collaboration,
		}
		
		const track = await Tracks.create(inputObj, { transaction: t });
		
		// creating collaborations if available
		if (obj.collaboration) {
			// firstly parsing the collaborators string to json, if present
			// collaborators should be an array of objects in the format:
			// { "collaborator": artist_id, "role": role_in_collaboration }
			const collaborators = JSON.parse(obj.collaborators);
		
			if (!collaborators || !Array.isArray(collaborators) || collaborators.length === 0) {
				throw new Error(`collaboration is true, but no collaborators provided`);
			}
	
			// adding the collaborators as their specific roles
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

const findInfo = async (trackId) => {
	const track = await Tracks.findByPk(trackId, {
		include: [{
			model: Users,
			attributes: ["id", "first_name", "last_name"],
		}, {
			model: Genres,
			attributes: ["name"],
		}, {
			model: Users,
			as: "collaborators",
			attributes: ["id", "first_name", "last_name"],
			through: {
				attributes: ["role_in_collaboration"]
			},
		}],
		attributes: ["id", "title", "description", "cover_art", "length", "release_date", "collaboration"],
	});
	if (!track) throw new Error('Track not found');

	return track.get({ plain: true })
}

module.exports = {
	upload,
	updateCoverArt,
	findInfo,
}