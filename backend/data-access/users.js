const { Users } = require("../models");

const create = async (obj) => {
	return await Users.create(obj);
};

const findByEmail = async (email) => {
	return await Users.findOne({ where: { email }});
};

module.exports = {
	create,
	findByEmail,
};