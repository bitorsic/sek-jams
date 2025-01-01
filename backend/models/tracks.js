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
		artist_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				notNull: true,
				notEmpty: true,
			},
			references: {
				model: "users",
				key: "id",
			},
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: true,
				notEmpty: true,
			},
		},
		description: {
			type: DataTypes.TEXT,
		},
		audio: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: true,
				notEmpty: true,
			},
		},
		cover_art: {
			type: DataTypes.STRING,
		},
		length: {
			type: DataTypes.DECIMAL,
			allowNull: false,
			validate: {
				notNull: true,
				notEmpty: true,
			},
		},
		genre_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				notNull: true,
				notEmpty: true,
			},
			references: {
				model: "genres",
				key: "id",
			},
		},
		release_date: {
			type: DataTypes.DATE,
			allowNull: false,
			validate: {
				notNull: true,
				notEmpty: true,
			},
		},
		collaboration: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			validate: {
				notNull: true,
				notEmpty: true,
			},
		}
	},
);

module.exports = Tracks;