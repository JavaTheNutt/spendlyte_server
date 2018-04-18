import RecurringDateManagement, {Frequency} from './RecurringDateManagement';
import * as format from 'date-fns/format';
import * as subDays from 'date-fns/sub_days';
import * as addDays from 'date-fns/add_days';
import * as addMonths from 'date-fns/add_months';
import * as isAfter from 'date-fns/is_after';
import * as getDay from 'date-fns/get_day';
import * as getDate from 'date-fns/get_date';
import {expect} from 'chai';
import 'mocha';

describe('RecurringDateManagement', () => {
	describe('daily dates', () => {
		describe('getNextDates', () => {
			it('should return 30 new dates', () => {
				const date = new RecurringDateManagement(
					[format(subDays(new Date(), 3), 'YYYY-MM-DD')],
					Frequency.daily
				);
				const newDates = date.getNextDates(30);
				expect(newDates.length).to.eql(31);
				expect(isAfter(date.getLatestDate(), addDays(new Date(), 25))).to.be.true;
			});
		});
	});
	describe('weekly dates', () => {
		describe('getNextDates', () => {
			it('should return 30 new dates', () => {
				const startDate = format(subDays(new Date(), 3), 'YYYY-MM-DD');
				const date = new RecurringDateManagement(
					[startDate],
					Frequency.weekly
				);
				const newDates = date.getNextDates(30);
				expect(newDates.length).to.eql(31);
				expect(isAfter(date.getLatestDate(), addDays(new Date(), 25))).to.be.true;
				newDates.forEach(date => {
					expect(getDay(startDate)).to.equal(getDay(date))
				});
			});
		});
	});
	describe('monthly dates', () => {
		describe('getNextDates', () => {
			it('should return 30 new dates', () => {
				const startDate = format(subDays(new Date(), 3), 'YYYY-MM-DD');
				const date = new RecurringDateManagement(
					[startDate],
					Frequency.monthly
				);
				const newDates = date.getNextDates(30);
				expect(newDates.length).to.eql(31);
				expect(isAfter(date.getLatestDate(), addDays(new Date(), 25))).to.be.true;
				newDates.forEach(date => {
					expect(getDate(startDate)).to.equal(getDate(date))
				});
			});
		});
	});
	describe('getNextDatesForPeriod', () => {
		it('should return an appropriate number of records', () => {
			const startDate = format(subDays(new Date(), 3), 'YYYY-MM-DD');
			const date = new RecurringDateManagement(
				[startDate],
				Frequency.monthly
			);
			const newDates = date.getNextDatesForMonths(6);
			expect(newDates.length).to.equal(7);
			expect(isAfter(date.getLatestDate(), addMonths(startDate, 5))).to.be.true;
		})
	})
});
