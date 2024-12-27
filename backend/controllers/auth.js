const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const users = require("../data-access/users");
const { s3Upload } = require("../services/awsService");

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

		if (!password) {
			return res.status(400).json({ message: `Password not provided` });
		}
		
		let user = await users.create({
			first_name,
			last_name,
			email,
			password: await bcrypt.hash(password, 10),
			bio,
			location,
		});

		// if a profile picture was provided, upload it to the s3 bucket
		if (req.file) {
			user.profile_picture = await s3Upload(`profile-pictures/${user.id}`, req.file);
      		await user.save();
		}

		return res.status(201).json();
	} catch (err) {
		if (err.name === "SequelizeUniqueConstraintError") {
			return res.status(409).json({ message: `Email already in use` });
		}

		console.error(`User registration error: ${err}`);
		return res.status(500).json({ message: `User registration failed: ${err.message}` });
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await users.findOne({
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

		return res.status(201).json(token);
	} catch (err) {
		console.error(`User login error: ${err}`);
		return res.status(500).json({ message: `User login failed: ${err.message}` });
	}
};