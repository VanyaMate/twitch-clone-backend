export const parseBoolean = function(value: unknown): boolean {
	if (typeof value === 'boolean') {
		return value;
	}

	if (typeof value === 'string') {
		const lowerCaseValue = value.trim().toLowerCase();
		if (lowerCaseValue === 'true') {
			return true;
		}

		if (lowerCaseValue === 'false') {
			return false;
		}
	}

	throw new Error(`Не удалость преобразовать значение "${ value }" к boolean типу`);
};