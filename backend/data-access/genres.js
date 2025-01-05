const { Genres } = require("../models");

const create = async (genreName) => {
	const genre = await Genres.create({ name: genreName });
	return genre.id;
}

module.exports = {
	create,
}