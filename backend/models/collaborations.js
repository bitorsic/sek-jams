const { DataTypes } = require('sequelize');
const sequelize = require("../config/dbConfig");

const Collaborations = sequelize.define(
	"collaborations",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
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
		role_in_collaboration: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: true,
				notEmpty: true,
			},
		},
	}, 
	{
		updatedAt: false,	
	}
);

module.exports = Collaborations;