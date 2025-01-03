const bcrypt = require("bcrypt");
const { Users } = require("../models");

const create = async (obj) => {
	const inputObj = {
		first_name: obj.first_name,
		last_name: obj.last_name,
		email: obj.email,
		bio: obj.bio,
		location: obj.location,
	};

	inputObj.password = await bcrypt.hash(obj.password, 10);
	const user = await Users.create(inputObj);
	return user.id;
};

const updateProfilePicture = async (userId, s3Url) => {
	const user = await Users.findByPk(userId);
	if (!user) throw new Error('User not found');
	user.profile_picture = s3Url;
	await user.save();
};

const findByEmail = async (email) => {
	return await Users.findOne({ where: { email }});
};

module.exports = {
	create,
	updateProfilePicture,
	findByEmail,
};