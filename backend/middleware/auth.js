const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
	try {
		let token = req.headers.authorization;
		if (!token) {
			return res.status(403).json({ message: "Not logged in" });
		}

		token = token.split(' ')[1];
		const { email } = jwt.verify(token, process.env.JWT_SECRET);

		req.user = { email };
		next();
	} catch (e) {
		if (error.name === "JsonWebTokenError") {
			return res.status(401).json({ message: "Invalid Token" });
		}
		if (error.name === "TokenExpiredError") {
			return res.status(401).json({ message: "Token has expired" });
		}
		// Default error handler
		console.error("Authentication Error:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

module.exports = verifyToken;