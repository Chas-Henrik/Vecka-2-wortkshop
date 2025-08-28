const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const composersRouter = require("./routes/composers");

const app = express();
app.use(express.json());
app.use("/composers", composersRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});


async function start() {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("✅ Connected to MongoDB");
		app.listen(port, () => {
			console.log(`Server running on http://localhost:${port}`);
		});
	} catch (err) {
		console.error("MongoDB connection error:", err.message);
		process.exit(1);
	}
}

start();