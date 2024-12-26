const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Users } = require("../models")

exports.register = async (req, res) => {
	try {
		const {
			first_name,
			last_name,
			email,
			password,
			bio,
			location,
		} = req.body;

		const user = await Users.create({
			first_name,
			last_name,
			email,
			password: await bcrypt.hash(password, 10),
			bio,
			location,
		});

		return res.status(201).send();
	} catch (err) {
		console.error(`User registration error: ${err}`);
		return res.status(500).send(`User registration failed: ${err.message}`);
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await Users.findOne({
			attributes: ["email", "role", "password"],
			where: { email }
		});

		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}

		if (!await bcrypt.compare(password, user.password)) {
			return res.status(403).json({ message: "Incorrect password" });
		}

		const token = jwt.sign(
			{ email: user.email, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "7d"},
		)

		return res.status(201).send({ token });
	} catch (err) {
		console.error(`User login error: ${err}`);
		return res.status(500).send(`User login failed: ${err.message}`);
	}
};