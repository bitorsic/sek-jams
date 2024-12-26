const { DataTypes } = require('sequelize');
const sequelize = require("../config/dbConfig");

const Tracks = sequelize.define(
	"tracks",
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
		audio_url: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		cover_art_url: {
			type: DataTypes.STRING,
		},
		length: {
			type: DataTypes.DECIMAL,
			allowNull: false,
		},
		genre_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "genres",
				key: "id",
			},
		},
		release_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		collaboration: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		}
	},
);

module.exports = Tracks;