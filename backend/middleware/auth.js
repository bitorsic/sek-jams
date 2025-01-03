const jwt = require("jsonwebtoken");

const verifyToken = (allowedRoles = []) => {
	return (req, res, next) => {
		try {
			const token = req.headers.authorization?.split(' ')[1];
			if (!token) {
				return res.status(403).json({ message: "Not logged in" });
			}
			
			const { id, role } = jwt.verify(token, process.env.JWT_SECRET);

			if (!allowedRoles.includes(role)) {
				return res.status(403).json({ message: "Insufficient permissions" });
			}

			req.user = { id };
			next();
		} catch (err) {
			if (err.name === "JsonWebTokenError") {
				return res.status(401).json({ message: "Invalid token" });
			}
			if (err.name === "TokenExpiredError") {
				return res.status(401).json({ message: "Token has expired" });
			}
			
			console.error(`Authentication error: ${err}`);
			res.status(500).json({ message: `Authentication failed: ${err.message}` });
		}
	}
};

module.exports = verifyToken;