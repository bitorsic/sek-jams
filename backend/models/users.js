const { DataTypes } = require('sequelize');
const sequelize = require("../config/dbConfig");

const Users = sequelize.define(
	"users",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		first_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		last_name: {
			type: DataTypes.STRING,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		profile_picture: {
			type: DataTypes.STRING,
		},
		bio: {
			type: DataTypes.TEXT,
		},
		role: {
			type: DataTypes.ENUM(["admin", "artist", "listener"]),
			allowNull: false,
		},
		location: {
			type: DataTypes.STRING,
		},
	},
);

module.exports = Users;