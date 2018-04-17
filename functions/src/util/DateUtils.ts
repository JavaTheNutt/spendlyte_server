import * as moment from 'moment';

export const getSkipFromMonthNum = (month: number): number => {
	console.log('fetching skip from month', month);
	const currentMonthNum = +moment().format('M');
	console.log('current month number', currentMonthNum);
	return month >= currentMonthNum ? month - currentMonthNum : 12 - ((month - currentMonthNum) * -1);
};

export const getFetchPeriod = (amount: number = 1, skip: number = 0): { start: string, end: string } => {
	console.log('getting fetch period of', amount, 'months skipping', skip);
	const startDate = moment().add(skip, 'months');
	return {
		start: startDate.format('YYYY-MM-DD'),
		end: startDate.add(amount, 'months').format('YYYY-MM-DD')
	}
};

export const fallsInFetchPeriod = (period: { start: string, end: string }, date: string): boolean => {
	console.log('testing if', date, 'falls between', period.start, 'and', period.end);
	const dateMoment = moment(date);
	return dateMoment.isSameOrBefore(period.end) && dateMoment.isSameOrAfter(period.start);
};
