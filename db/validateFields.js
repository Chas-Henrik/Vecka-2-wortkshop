
// db/validateFields.js
// function validateModel(schema, data) {
// 	const allowedFields = Object.keys(schema.paths).filter(
// 		(field) => field !== '__v' && field !== '_id' && !field.includes('.')
// 	);

// 	const invalidFields = Object.keys(data).filter(
// 		(key) => !allowedFields.includes(key)
// 	);

// 	return invalidFields;
// };

function validateModel(schema, data) {
	const allowedFields = Object.keys(schema.paths).filter(
		(field) => field !== '__v' && field !== '_id' && !field.includes('.')
	);

	const invalidFields = [];
	const typeMismatchFields = [];

	for (const key of Object.keys(data)) {
		if (!allowedFields.includes(key)) {
			invalidFields.push(key);
			continue;
		}

		const schemaType = schema.paths[key].instance; // e.g., 'String', 'Number', 'Array'

		// Type checks
		const value = data[key];

		if (
			(schemaType === 'String' && typeof value !== 'string') ||
			(schemaType === 'Number' && typeof value !== 'number') ||
			(schemaType === 'Boolean' && typeof value !== 'boolean') ||
			(schemaType === 'Array' && !Array.isArray(value)) ||
			(schemaType === 'Date' && !(value instanceof Date || !isNaN(Date.parse(value))))
		) {
			typeMismatchFields.push({ field: key, expected: schemaType, actual: typeof value });
		}
	}

	return { invalidFields, typeMismatchFields };
}


module.exports = validateModel;