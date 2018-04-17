import Item from './Item';
import {expect} from 'chai';

import * as format from 'date-fns/format';
import 'mocha';
import MonthlyDateManagement from "./MonthlyDateManagement";

describe('Item', () => {
	describe('getAmountForDates', () => {
		it('should return the amount times the number of dates on record', () => {
			const item = new Item('wages', 1000,1, {
				isRecurring: true,
				dates: [format(new Date(), 'YYYY-MM-DD')],
				frequency: 'monthly',
				freq01: 'end',
				type: 'inv'
			}, ['wages', 'income']);
			expect(item.getAmountForDates()).to.equal(1000)
		});
		it('should take recurrence into account', () => {
			const item = new Item('wages', 1000, 1, {
				isRecurring: true,
				dates: [format(new Date(), 'YYYY-MM-DD')],
				frequency: 'monthly',
				freq01: 'end',
				type: 'inv'
			}, ['wages', 'income']);
			(<MonthlyDateManagement>item.dates).getNextDates(6);
			expect(item.getAmountForDates()).to.equal(7000)
		});
	});
	describe('getAmountForUserEnteredDates', () => {
		it('should not take recurrence into account', () => {
			const item = new Item('wages', 1000, 1, {
				isRecurring: true,
				dates: [format(new Date(), 'YYYY-MM-DD')],
				frequency: 'monthly',
				freq01: 'end',
				type: 'inv'
			}, ['wages', 'income']);
			(<MonthlyDateManagement>item.dates).getNextDates(6);
			expect(item.getAmountForUserEnteredDates()).to.equal(1000)
		});
	});
	describe('formatForSaving', () => {
		it('should format the item to be saved', () => {
			const tstDate = format(new Date(), 'YYYY-MM-DD');
			const item = new Item('wages', 1000, 1, {
				isRecurring: true,
				dates: [tstDate],
				frequency: 'monthly',
				freq01: 'end',
				type: 'inv'
			}, ['wages', 'income']);
			(<MonthlyDateManagement>item.dates).getNextDates(6);
			const res = item.formatForSaving();
			console.log(res);
			expect(res).to.eql({
				title: 'wages',
				amount: 1000,
				tags: ['wages', 'income'],
				dates:{
					dates: [tstDate],
					frequency: 'MONTHLY',
					interval: 1,
					freqType: 'inv',
					freq01: 'end'
				}
			})
		});
	});
});
