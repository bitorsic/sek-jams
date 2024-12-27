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
			validate: {
				notNull: true,
				notEmpty: true,
			},
		},
		last_name: {
			type: DataTypes.STRING,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: true,
				notEmpty: true,
				isEmail: true,
			},
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: true,
				notEmpty: true,
			},
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
			validate: {
				notNull: true,
				notEmpty: true,
			},
			defaultValue: "listener",
		},
		location: {
			type: DataTypes.STRING,
		},
	},
);

module.exports = Users;