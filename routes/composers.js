const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { createComposer, findComposers } = require("../db/composerCrud");
const ComposerModel = require("../db/models/composer");

// POST /composers
router.post("/", async (req, res) => {
	try {
		const createdComposer = await createComposer(req.body);
		res.status(201).json(createdComposer);
	} catch (err) {
		if (err.code === 11000) {
			return res.status(409).json({ error: "Name must be unique" });
		}
		res
			.status(400)
			.json({ error: "Validation error", details: err.message });
	}
});


// GET /composers
router.get("/", async (req, res) => {
	const composers = await findComposers();
	res.json(composers);
});

// GET /composers/id
router.get("/:id", async (req, res) => {
	//Hämta composer med id

	if (!mongoose.isValidObjectId(req.params.id)) {
		return res.status(400).json({ error: "ID must be valid ObjectID" });
	}

	try {
		const composer = await ComposerModel.findById(req.params.id);
		if (!composer) {
			return res.status(404).json({ error: "Composer not found" });
		}
		return res.json(composer);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

router.put("/:id", async (req, res) => {
	//Uppdatera en specifik composer
	try {
		const composer = await ComposerModel.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!composer) {
			return res.status(404).json({ error: "composer not found" });
		}
		return res.json(composer);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
});

router.delete("/:id", async (req, res) => {
	//Ta bort en composer baserat på ID
	try {
		const composer = await ComposerModel.findByIdAndDelete(req.params.id);
		if (!composer) {
			return res.status(404).json({ error: "Composer not found" });
		}
		return res.status(200).json(`Composer was successfully deleted. ${composer}`);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
});

module.exports = router;
