const { Users } = require("../models");

const create = async (obj) => {
	return await Users.create(obj);
};

const findOne = async (options) => {
	return await Users.findOne(options);
};

module.exports = {
	create,
	findOne,
};