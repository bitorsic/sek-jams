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
			references: {
				model: "tracks",
				key: "id",
			},
		},
		artist_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "users",
				key: "id",
			},
		},
		role_in_collaboration: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	}, 
	{
		updatedAt: false,	
	}
);

module.exports = Collaborations;