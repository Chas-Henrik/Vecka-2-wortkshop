const ComposerModel = require("./models/composer");

const createComposer = async (composer) => {
	const newComposer = new ComposerModel(composer);
	return newComposer.save();
};

const findComposers = async () => ComposerModel.find().lean();

module.exports = { createComposer, findComposers };
