import * as moment from 'moment';
export const getSkipFromMonthNum = (month: number): number => {
	console.log('fetching skip from month', month);
	const currentMonthNum = +moment().format('M');
	console.log('current month number', currentMonthNum);
	return month >= currentMonthNum ? month - currentMonthNum : 12 - ((month - currentMonthNum) * -1);
};
