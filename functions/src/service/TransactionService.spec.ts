import { expect } from 'chai';

import { getFutureTransactions, getNextDate } from './TransactionService';
import 'mocha';
import * as moment from 'moment';
import Transaction from "../models/Transaction";

describe('TransactionService', () => {
	describe('getFutureTransactions', () => {
		it('should return 12 Weekly transactions by default', () => {
			const transaction = new Transaction('something', 'wages', 2300, 'Weekly', moment().format('YYYY-MM-DD'));
			const transactionList = getFutureTransactions(transaction);
			expect(transactionList.length).to.equal(12);
		});
		it('should return 3 Monthly transactions by default', () => {
			const transaction = new Transaction('something', 'wages', 2300, 'Monthly', moment().format('YYYY-MM-DD'));
			const transactionList = getFutureTransactions(transaction);
			expect(transactionList.length).to.equal(3);
		});
		it('should return 90 Daily transactions by default', () => {
			const transaction = new Transaction('something', 'wages', 2300, 'Daily', moment().format('YYYY-MM-DD'));
			const transactionList = getFutureTransactions(transaction);
			expect(transactionList.length).to.equal(90);
		});
		it('should return 4 Weekly transactions when one month is specified', () => {
			const transaction = new Transaction('something', 'wages', 2300, 'Weekly', moment().format('YYYY-MM-DD'));
			const transactionList = getFutureTransactions(transaction, 1);
			expect(transactionList.length).to.equal(4);
		});
		it('should return 1 Monthly transactions when one month is specified', () => {
			const transaction = new Transaction('something', 'wages', 2300, 'Monthly', moment().format('YYYY-MM-DD'));
			const transactionList = getFutureTransactions(transaction, 1);
			expect(transactionList.length).to.equal(1);
		});
		it('should return 30 Daily transactions when one month is specified', () => {
			const transaction = new Transaction('something', 'wages', 2300, 'Daily', moment().format('YYYY-MM-DD'));
			const transactionList = getFutureTransactions(transaction, 1);
			expect(transactionList.length).to.equal(30);
		});
		it('should return only future transactions', () => {
			const transaction = new Transaction('something', 'wages', 2300, 'Daily', moment().subtract(10, 'days').format('YYYY-MM-DD'));
			const transactionList = getFutureTransactions(transaction, 1);
			expect(moment(transactionList[0].nextDueDate).isSameOrAfter(moment().subtract(1, 'day'))).to.be.true;
		});
		it('should skip the specified number of months', () => {
			const transaction = new Transaction('something', 'wages', 2300, 'Daily', moment().format('YYYY-MM-DD'));
			const transactionList = getFutureTransactions(transaction, 1, 3);
			expect(moment(transactionList[0].nextDueDate)
				.isSameOrAfter(moment().add(9, 'weeks'))).to.be.true;
		})
	});
	describe('getNextDate', ()=>{
		it('should return the date incremented by one month for monthly transactions', () => {
			const now: string = moment().format('YYYY-MM-DD');
			const result = getNextDate(now, 'Monthly');
			expect(result).to.equal(moment().add(1, 'months').format('YYYY-MM-DD'))
		});
		it('should return the date incremented by one week for weekly transactions', () => {
			const now: string = moment().format('YYYY-MM-DD');
			const result = getNextDate(now, 'Weekly');
			expect(result).to.equal(moment().add(1, 'weeks').format('YYYY-MM-DD'))
		});
		it('should return the date incremented by one day for daily transactions', () => {
			const now: string = moment().format('YYYY-MM-DD');
			const result = getNextDate(now, 'Daily');
			expect(result).to.equal(moment().add(1, 'day').format('YYYY-MM-DD'))
		});
	})
});
