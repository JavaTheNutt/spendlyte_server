import MonthlyDateManagement, {MonthlyFrequencyType} from './MonthlyDateManagement';
import * as format from 'date-fns/format';
import * as subDays from 'date-fns/sub_days';
import * as addDays from 'date-fns/add_days';
import * as addMonths from 'date-fns/add_months';
import * as startOfMonth from 'date-fns/start_of_month';
import * as endOfMonth from 'date-fns/end_of_month';
import * as setDate from 'date-fns/set_date';
import * as isAfter from 'date-fns/is_after';
import * as getDay from 'date-fns/get_day';
import * as getDate from 'date-fns/get_date';
import {expect} from 'chai';
import 'mocha';
import {setMonth} from "date-fns";

describe('MonthlyDateManagement', () => {
	const startDate = format(new Date(), 'YYYY-MM-DD');
	describe('getNextDates', () => {
		describe('inv', () => {
			it('should return the next months dates for dates that occur at the start', () => {
				const monthlyDate = new MonthlyDateManagement([startDate], 'start');
				const newDates = monthlyDate.getNextDates();
				const latestdate = monthlyDate.getLatestDate();
				console.log('latestdate', latestdate);
				expect(latestdate).to.equal(format(startOfMonth(addMonths(startDate, 1)), 'YYYY-MM-DD'));
			});
			it('should return the next months dates for dates that occur at the end', () => {
				const monthlyDate = new MonthlyDateManagement([startDate], 'end');
				const newDates = monthlyDate.getNextDates();
				const latestdate = monthlyDate.getLatestDate();
				console.log('latestdate', latestdate);
				expect(latestdate).to.equal(format(endOfMonth(addMonths(startDate, 1)), 'YYYY-MM-DD'));
			});
			it('should return the next months dates for dates that occur in the middle, and contain an even number of days', () => {
				const newDate = format(setMonth(startDate, 8), 'YYYY-MM-DD');
				console.log(newDate);
				const monthlyDate = new MonthlyDateManagement([newDate], 'middle');
				console.log(format(newDate, 'YYYY-MM-DD'));
				const newDates = monthlyDate.getNextDates();
				const latestdate = monthlyDate.getLatestDate();
				console.log('latestdate', latestdate);
				expect(latestdate).to.equal(format(addDays(startOfMonth(addMonths(newDate, 1)), 14), 'YYYY-MM-DD'));
			});
			it('should return the next months dates for dates that occur in the middle, and contain an odd number of days', () => {
				const newDate = format(setMonth(startDate, 7), 'YYYY-MM-DD');
				console.log(newDate);
				const monthlyDate = new MonthlyDateManagement([newDate], 'middle');
				const newDates = monthlyDate.getNextDates();
				const latestdate = monthlyDate.getLatestDate();
				console.log('latestdate', latestdate);
				expect(latestdate).to.equal(format(addDays(startOfMonth(addMonths(newDate, 1)), 14), 'YYYY-MM-DD'));
			});
		});
		describe('dim', () => {
			it('should return the date in a new month with the correct day', () => {
				const monthlyDate = new MonthlyDateManagement([startDate], '23', null, MonthlyFrequencyType.DAY_IN_MONTH);
				monthlyDate.getNextDates();
				const latestDate = monthlyDate.getLatestDate();
				expect(latestDate).to.equal(format(setDate(addMonths(startDate, 1), 23), 'YYYY-MM-DD'))
			})
		});
		describe('wdim', () => {
			it('should return the correct value', () => {
				let monthlyDate = new MonthlyDateManagement(['2018-04-14'], 'first', 'monday', MonthlyFrequencyType.WEEKDAY_IN_MONTH);
				monthlyDate.getNextDates();
				expect('2018-05-07').to.equal(monthlyDate.getLatestDate());
				monthlyDate = new MonthlyDateManagement(['2018-04-14'], 'second', 'monday', MonthlyFrequencyType.WEEKDAY_IN_MONTH);
				monthlyDate.getNextDates();
				expect('2018-05-14').to.equal(monthlyDate.getLatestDate());
				monthlyDate = new MonthlyDateManagement(['2018-04-14'], 'third', 'thursday', MonthlyFrequencyType.WEEKDAY_IN_MONTH);
				monthlyDate.getNextDates();
				expect('2018-05-24').to.equal(monthlyDate.getLatestDate());
			})
		})
	});
});
