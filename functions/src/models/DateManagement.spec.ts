import DateManagement from './DateManagement';
import * as format from 'date-fns/format';
import * as addDay from 'date-fns/add_days';
import * as subDays from 'date-fns/sub_days';
import {expect} from 'chai';
import 'mocha';

describe('DateManagement', () => {
	describe('getLastestDate', () => {
		it('should return the latest date in the dates array', () => {
			const date = new DateManagement(false, ['2018-08-09', '2018-07-09', '2018-10-1', '2018-09-09', '2018-08-10']);
			const latestDate = date.getLatestDate();
			expect(latestDate).to.equal('2018-10-01');
		})
	});
	describe('addDate', () => {
		it('should add a date to the dates array', () => {
			const date = new DateManagement(false, ['2018-08-09', '2018-07-09', '2018-10-1', '2018-09-09', '2018-08-10']);
			date.addDate('2019-01-01');
			const latestDate = date.getLatestDate();
			expect(latestDate).to.equal('2019-01-01');
		})
	});
	describe('occurrs today', () => {
		it('should return true if the date happens today', () => {
			const date = new DateManagement(false, [format(new Date(), 'YYYY-MM-DD')]);
			const occurrsToday = date.occursToday;
			expect(occurrsToday).to.be.true;
		});
		it('should return false if the date happens today', () => {
			const date = new DateManagement(false, [format(addDay(new Date(), 2), 'YYYY-MM-DD')]);
			const occurrsToday = date.occursToday;
			expect(occurrsToday).to.be.false;
		});
	});
	describe('occurrs this week', () => {
		it('should return true if the date happens today', () => {
			const date = new DateManagement(false, [format(new Date(), 'YYYY-MM-DD')]);
			const occursThisWeek = date.occursThisWeek;
			expect(occursThisWeek).to.be.true;
		});
		it('should return true if the date happens within this week', () => {
			const date = new DateManagement(false, [format(addDay(new Date(), 2), 'YYYY-MM-DD')]);
			const occursThisWeek = date.occursThisWeek;
			expect(occursThisWeek).to.be.true;
		});
		it('should return true if the date happens exactly one week from now', () => {
			const date = new DateManagement(false, [format(addDay(new Date(), 7), 'YYYY-MM-DD')]);
			const occursThisWeek = date.occursThisWeek;
			expect(occursThisWeek).to.be.true;
		});
		it('should return true if the date happens 6 days from now', () => {
			const date = new DateManagement(false, [format(addDay(new Date(), 6), 'YYYY-MM-DD')]);
			const occursThisWeek = date.occursThisWeek;
			expect(occursThisWeek).to.be.true;
		});
		it('should return false if the date happens outside this week', () => {
			const date = new DateManagement(false, [format(addDay(new Date(), 8), 'YYYY-MM-DD')]);
			const occursThisWeek = date.occursThisWeek;
			expect(occursThisWeek).to.be.false;
		});
	});
	describe('occurrs this month', () => {
		it('should return true if the date happens today', () => {
			const date = new DateManagement(false, [format(new Date(), 'YYYY-MM-DD')]);
			const occursThisMonth = date.occursThisMonth;
			expect(occursThisMonth).to.be.true;
		});
		it('should return true if the date happens within this week', () => {
			const date = new DateManagement(false, [format(addDay(new Date(), 2), 'YYYY-MM-DD')]);
			const occursThisMonth = date.occursThisMonth;
			expect(occursThisMonth).to.be.true;
		});
		it('should return true if the date happens exactly one week from now', () => {
			const date = new DateManagement(false, [format(addDay(new Date(), 7), 'YYYY-MM-DD')]);
			const occursThisMonth = date.occursThisMonth;
			expect(occursThisMonth).to.be.true;
		});
		it('should return true if the date happens 6 days from now', () => {
			const date = new DateManagement(false, [format(addDay(new Date(), 6), 'YYYY-MM-DD')]);
			const occursThisMonth = date.occursThisMonth;
			expect(occursThisMonth).to.be.true;
		});
		it('should return true if the date happens outside this week', () => {
			const date = new DateManagement(false, [format(addDay(new Date(), 8), 'YYYY-MM-DD')]);
			const occursThisMonth = date.occursThisMonth;
			expect(occursThisMonth).to.be.true;
		});
		it('should return true if the date happens 29 days from now', () => {
			const date = new DateManagement(false, [format(addDay(new Date(), 29), 'YYYY-MM-DD')]);
			const occursThisMonth = date.occursThisMonth;
			expect(occursThisMonth).to.be.true;
		});
		it('should return true if the date happens one month from now', () => {
			const date = new DateManagement(false, [format(addDay(new Date(), 30), 'YYYY-MM-DD')]);
			const occursThisMonth = date.occursThisMonth;
			expect(occursThisMonth).to.be.true;
		});
		it('should return false if the date happens more than one month from now', () => {
			const date = new DateManagement(false, [format(addDay(new Date(), 31), 'YYYY-MM-DD')]);
			const occursThisMonth = date.occursThisMonth;
			expect(occursThisMonth).to.be.false;
		});
	});
	describe('countMonthlyOccurrence', () => {
		it('should count the amount of dates that occur in a month', () => {
			const date = new DateManagement(false, [
				format(addDay(new Date(), 31), 'YYYY-MM-DD'),
				format(addDay(new Date(), 12), 'YYYY-MM-DD'),
				format(addDay(new Date(), 1), 'YYYY-MM-DD'),
				format(addDay(new Date(), 6), 'YYYY-MM-DD'),
				format(addDay(new Date(), 32), 'YYYY-MM-DD')
			]);
			const occursThisMonth = date.monthlyOccurrenceCount;
			expect(occursThisMonth).to.equal(3);
		});
	});
	describe('countWeeklyOccurrence', () => {
		it('should count the amount of dates that occur in a week', () => {
			const date = new DateManagement(false, [
				format(addDay(new Date(), 31), 'YYYY-MM-DD'),
				format(addDay(new Date(), 12), 'YYYY-MM-DD'),
				format(addDay(new Date(), 1), 'YYYY-MM-DD'),
				format(addDay(new Date(), 6), 'YYYY-MM-DD'),
				format(addDay(new Date(), 32), 'YYYY-MM-DD')
			]);
			const occursThisMonth = date.weeklyOccurrenceCount;
			expect(occursThisMonth).to.equal(2);
		});
	});
	describe('getWeeklyDates', () => {
		it('should return all dates that occur in a week', () => {
			const datesWithinWeek = [
				format(addDay(new Date(), 1), 'YYYY-MM-DD'),
				format(addDay(new Date(), 6), 'YYYY-MM-DD')
			];
			const daysOutsideWeek = [
				format(addDay(new Date(), 31), 'YYYY-MM-DD'),
				format(addDay(new Date(), 12), 'YYYY-MM-DD'),
				format(addDay(new Date(), 32), 'YYYY-MM-DD')
			];
			const date = new DateManagement(false, daysOutsideWeek.concat(datesWithinWeek));
			const occursThisMonth = date.getWeeklyDates();
			expect(occursThisMonth).to.eql(datesWithinWeek);
		});
	});
	describe('getMonthlyDates', () => {
		it('should return all dates that occur in a month', () => {
			const datesWithinMonth = [
				format(addDay(new Date(), 1), 'YYYY-MM-DD'),
				format(addDay(new Date(), 6), 'YYYY-MM-DD'),
				format(addDay(new Date(), 12), 'YYYY-MM-DD')
			];
			const daysOutsideMonth = [
				format(addDay(new Date(), 31), 'YYYY-MM-DD'),
				format(addDay(new Date(), 32), 'YYYY-MM-DD')
			];
			const date = new DateManagement(false, daysOutsideMonth.concat(datesWithinMonth));
			const occursThisMonth = date.getMonthlyDates();
			expect(occursThisMonth).to.eql(datesWithinMonth);
		});
	});
	describe('monthlyOccurrenceDates', () => {
		it('should return all of the dates that occur within 30 days', () => {
			const datesWithinMonth = [
				format(addDay(new Date(), 1), 'YYYY-MM-DD'),
				format(addDay(new Date(), 6), 'YYYY-MM-DD'),
				format(addDay(new Date(), 12), 'YYYY-MM-DD')
			];
			const daysOutsideMonth = [
				format(addDay(new Date(), 31), 'YYYY-MM-DD'),
				format(addDay(new Date(), 32), 'YYYY-MM-DD')
			];
			const date = new DateManagement(false, daysOutsideMonth.concat(datesWithinMonth));
			expect(date.occursThisMonth).to.equal(true);
			expect(date.monthlyOccurrenceCount).to.equal(3);
			expect(date.monthlyOccurrenceDates).to.eql(datesWithinMonth);
		});
	});
	describe('isFuture', () => {
		it('should return all future dates', () => {})
		const futureDates = [
			format(new Date(), 'YYYY-MM-DD'),
			format(addDay(new Date(), 1), 'YYYY-MM-DD')
		];
		const pastDates = [
			format(subDays(new Date(), 1), 'YYYY-MM-DD')
		];
		const dates = new DateManagement(false, futureDates.concat(pastDates));
		expect(dates.getFuture()).to.eql(futureDates)
	});
	describe('isPast', () => {
		it('should return all past dates', () => {
			const futureDates = [
				format(addDay(new Date(), 1), 'YYYY-MM-DD')
			];
			const pastDates = [
				format(new Date(), 'YYYY-MM-DD'),
				format(subDays(new Date(), 1), 'YYYY-MM-DD')
			];
			const dates = new DateManagement(false, futureDates.concat(pastDates));
			expect(dates.getPast()).to.eql(pastDates)
		});

	})
});
