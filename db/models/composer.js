const mongoose = require("mongoose");

const composerSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true, unique: true },
		born: { type: Number, required: true },
		death: { type: Number },
		era: { type: String, required: true, trim: true },
		bio: { type: String, required: true },
		notableWorks: { 
            type: [String], 
            default: [],
            validate: {
				validator: function (value) {
					// Ensure no duplicates in the array
					const uniqueValues = new Set(value);
					return uniqueValues.size === value.length;
				},
				message: "Duplicate works are not allowed in notableWorks",
			},
        },
	},
	{ timestamps: true }
);


const ComposerModel = mongoose.model("Composer", composerSchema);
module.exports = ComposerModel;