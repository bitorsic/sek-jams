const { DataTypes } = require('sequelize');
const sequelize = require("../config/dbConfig");

const Genres = sequelize.define(
	"genres",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: true,
				notEmpty: true,
			},
			unique: true,
		},
	},
);

module.exports = Genres;