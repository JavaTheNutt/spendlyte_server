export const titleCaseArray = (values: Array<string>) : string => {
	console.log('performing title case on array');
	const resultArray: Array<string> = [];
	values.forEach(value => resultArray.push(`${value[0].toUpperCase()}${value.substring(1).toLowerCase()}`));
	return resultArray.join(' ');
};
export const titleCaseString = (str: string): string => titleCaseArray(str.split(' '));
