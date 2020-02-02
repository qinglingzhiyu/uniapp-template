export const oneOf = (value, validList) => {
	for (let i = 0; i < validList.length; i++) {
		if (value === validList[i]) {
			return true;
		}
	}
	throw new Error('mode无效，请选择有效的mode!');
	return false;
}
