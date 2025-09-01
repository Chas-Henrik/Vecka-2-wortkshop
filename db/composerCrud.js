const ComposerModel = require("./models/composer");

const createComposer = async (composer) => {
	const newComposer = new ComposerModel(composer);
	return newComposer.save();
};

// const findComposers = async () => ComposerModel.find().lean();

async function findComposers(req) {
    const { name, era, born, bornFrom, bornTo, sort, limit=10, page=1 } = req.query;
    const filter = {};

    if (name) filter.name = new RegExp(name,"i");
    if (era) filter.era = new RegExp(era,"i");
    if (born) filter.born = parseInt(born);

    if (bornFrom || bornTo) {
        filter.born = {};
        if (bornFrom) filter.born.$gte = parseInt(bornFrom);
        if (bornTo) filter.born.$lte = parseInt(bornTo);
    }

    // Build sort object dynamically
    let sortBy = {};
    if (sort) {
        const sortField = sort.startsWith("-") ? sort.slice(1) : sort;
        const sortOrder = sort.startsWith("-") ? -1 : 1;
        sortBy[sortField] = sortOrder;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    return composers = await ComposerModel.find(filter).lean().sort(sortBy).limit(parseInt(limit)).skip(skip);
}

async function composersStats() {
    const stats = await ComposerModel.aggregate([
        {
            $facet: {
                totalComposers: [{ $count: "count" }],
                averageBornYear: [
                    { $group: { _id: null, avgBorn: { $avg: "$born" } } }
                ],
                eraDistribution: [
                    { $group: { _id: "$era", count: { $sum: 1 } } },
                    { $sort: { count: -1 } }
                ]
            }
        }
    ]);

    // Flatten and clean up the result
    const result = {
        totalComposers: stats[0].totalComposers[0]?.count || 0,
        averageBornYear: stats[0].averageBornYear[0]?.avgBorn || null,
        eraDistribution: stats[0].eraDistribution.map(item => ({
            era: item._id,
            count: item.count
        }))
    };

    return result;
}

module.exports = { createComposer, findComposers, composersStats };
