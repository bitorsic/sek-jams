const { DataTypes } = require('sequelize');
const sequelize = require("../config/dbConfig");

const PlaylistTracks = sequelize.define(
	"playlist_tracks",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		playlist_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				notNull: true,
				notEmpty: true,
			},
			references: {
				model: "playlists",
				key: "id",
			},
		},
		track_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				notNull: true,
				notEmpty: true,
			},
			references: {
				model: "tracks",
				key: "id",
			},
		},
	},
	{
		updatedAt: false,	
	}
);

module.exports = PlaylistTracks;