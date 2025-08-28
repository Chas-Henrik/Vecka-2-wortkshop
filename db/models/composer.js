const mongoose = require("mongoose");

const composerSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true, unique: true },
		born: { 
            type: Number, 
            required: true, 
            min: [0, "Year cannot be negative"],
			max: [new Date().getFullYear(), "Year cannot be in the future"],
        },
		death: { 
            type: Number,
            min: [0, "Year cannot be negative"],
			max: [new Date().getFullYear(), "Year cannot be in the future"]
        },
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