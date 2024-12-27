const { DataTypes } = require('sequelize');
const sequelize = require("../config/dbConfig");

const Followers = sequelize.define(
	"followers",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		follower_id: {
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
		followed_id: {
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
	},
);

module.exports = Followers;