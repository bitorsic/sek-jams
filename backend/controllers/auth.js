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
		
		let userId = await users.create({
			first_name,
			last_name,
			email,
			password,
			bio,
			location,
		});

		// if a profile picture was provided, upload it to the s3 bucket
		if (req.files?.profile_picture) {
			const s3Url = await s3Upload(
				`public/profile-pictures/${userId}`, 
				req.files.profile_picture[0], // as the key has array instead of single file
			);
      		await users.updateProfilePicture(3, s3Url);
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

		const user = await users.findByEmail(email);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (!await bcrypt.compare(password, user.password)) {
			return res.status(403).json({ message: "Incorrect password" });
		}

		const token = jwt.sign(
			{ id: user.id, email: user.email, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "7d"},
		)

		return res.status(201).json({ token });
	} catch (err) {
		console.error(`User login error: ${err}`);
		return res.status(500).json({ message: `User login failed: ${err.message}` });
	}
};