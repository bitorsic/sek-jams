require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
const sequelize = require('./config/dbConfig');
require("./models/associations"); // needed for proper associations in the database

app.use("/api/auth", require("./routes/auth"));
app.use("/api/tracks", require("./routes/tracks"));
app.use("/api/genres", require("./routes/genres"));

(async () => {
	try {
		await sequelize.authenticate();
		console.log("[+] Connection to database established successfully");

		// await sequelize.sync();
		// console.log('[+] All models were synchronized successfully');

		const PORT = process.env.PORT || 3000;
		app.listen(PORT, () => {
			console.log(`[+] Server running on port ${PORT}`);
		});
	} catch (e) {
		console.error("[-] Could not connect to the database\n", e);
	}
})();