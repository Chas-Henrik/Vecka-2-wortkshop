const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { createComposer, findComposers, composersStats } = require("../db/composerCrud");
const ComposerModel = require("../db/models/composer");
const validateModel = require("../db/validateFields");

// POST /composers
router.post("/", async (req, res) => {
	try {
		const result = validateModel(ComposerModel.schema, req.body);

        if (result.invalidFields.length > 0 || result.typeMismatchFields.length > 0) {
            return res.status(400).json({
                error: "Invalid input",
                invalidFields: result.invalidFields,
                typeMismatchFields: result.typeMismatchFields,
            });
        }

		const createdComposer = await createComposer(req.body);
		return res.status(201).json(createdComposer);
	} catch (err) {
		if (err.code === 11000) {
			return res.status(409).json({ error: "Name must be unique" });
		}
		return res
			.status(400)
			.json({ error: "Validation error", details: err.message });
	}
});


// GET /composers
router.get("/", async (req, res) => {
    try {
        const composers = await findComposers(req);
        return res.json(composers);
    } catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

// GET /composers/stats
router.get("/stats", async (req, res) => {
	try {
		const result = await composersStats();

		return res.json(result);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
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

// PUT /composers/id
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

// PATCH /composers/:id/notable-work
router.patch("/:id/notable-work", async (req, res) => {
	try {
		const { id } = req.params;
		const { work } = req.body;
        console.log("work", work)
		if (!work || typeof work !== "string") {
			return res.status(400).json({ error: "A valid 'work' string is required" });
		}

		const updatedComposer = await ComposerModel.findByIdAndUpdate(
			id,
			{ $addToSet: { notableWorks: work } }, // <== No duplicates
			{ new: true, runValidators: true }
		).select("_id name notableWorks");

		if (!updatedComposer) {
			return res.status(404).json({ error: "Composer not found" });
		}

		return res.json(updatedComposer);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

// DELETE /composers/id
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

// DELETE /composers/:id/notable-work
router.delete("/:id/notable-work", async (req, res) => {
	try {
		const { id } = req.params;
		const { work } = req.body;

		if (!work || typeof work !== "string") {
			return res.status(400).json({ error: "A valid 'work' string is required" });
		}

		const updatedComposer = await ComposerModel.findByIdAndUpdate(
			id,
			{ $pull: { notableWorks: work } },
			{ new: true, runValidators: true }
		).select("_id name notableWorks");

		if (!updatedComposer) {
			return res.status(404).json({ error: "Composer not found" });
		}

		return res.json(updatedComposer);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});
