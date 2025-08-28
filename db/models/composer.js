const mongoose = require("mongoose");

const composerSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true, unique: true },
		born: { type: Number, required: true },
		death: { type: Number }, // valfri
		era: { type: String, required: true, trim: true },
		bio: { type: String, required: true },
		notableWorks: { type: [String], default: [] },
	},
	{ timestamps: true }
);

const ComposerModel = mongoose.model("Composer", composerSchema);
module.exports = ComposerModel;