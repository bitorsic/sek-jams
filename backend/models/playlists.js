const { DataTypes } = require('sequelize');
const sequelize = require("../config/dbConfig");

const Playlists = sequelize.define(
	"playlists",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "users",
				key: "id",
			},
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
		},
		cover_art_url: {
			type: DataTypes.STRING,
		},
	},
);

module.exports = Playlists;