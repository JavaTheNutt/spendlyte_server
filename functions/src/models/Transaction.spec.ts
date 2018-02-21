import Transaction from './Transaction';
import {expect} from 'chai';
import * as moment from 'moment';
import 'mocha';
import {type} from "os";

describe('Transaction.ts', () => {
	it('should create an object with default constructor', () => {
		const transaction = new Transaction();
		expect(transaction).to.be.instanceOf(Transaction);
	});
	describe('clone', () => {
		it('should return an object which deeply, but not strictly, equals the original', () => {
			const transaction = new Transaction('someid', 'wages', 2333, 'Monthly', '2018-09-09');
			const newTransaction = transaction.clone();
			expect(transaction).to.not.equal(newTransaction);
			expect(transaction).to.eql(newTransaction);
			newTransaction.id = 'someotherid';
			expect(transaction.id).to.equal('someid');
		});
	});
	describe('isFuture', ()=>{
		it('should return true when the due date is in the future', () => {
			const date = moment().add(10, 'days').format('YYYY-MM-DD');
			const transaction = new Transaction('someid', 'wages', 2333, 'Monthly', date);
			expect(transaction.isFuture()).to.be.true;
		});
		it('should return false when the due date is not in the future', () => {
			const date = moment().subtract(10, 'days').format('YYYY-MM-DD');
			const transaction = new Transaction('someid', 'wages', 2333, 'Monthly', date);
			expect(transaction.isFuture()).to.be.false;
		});
	});
	describe('mapForClient', () => {
		it('should return the transaction in mapped format', () => {
			const transaction = new Transaction('someid', 'wages', 2333, 'Monthly', '2018-09-09', 'Income');
			const mappedTransaction = transaction.mapForClient();
			expect(mappedTransaction).to.eql({id: 'someid', title: 'wages', amount: 2333, frequency: 'Monthly', due: '2018-09-09', type: 'Income'})
		})
	});
	describe('isRecurring', () => {
		it('should return true for daily transactions', () => {
			const transaction = new Transaction('someid', 'wages', 2333, 'Daily', '2018-09-09');
			expect(transaction.isRecurring()).to.be.true;
		});
		it('should return true for weekly transactions', () => {
			const transaction = new Transaction('someid', 'wages', 2333, 'Weekly', '2018-09-09');
			expect(transaction.isRecurring()).to.be.true;
		});
		it('should return true for monthly transactions', () => {
			const transaction = new Transaction('someid', 'wages', 2333, 'Monthly', '2018-09-09');
			expect(transaction.isRecurring()).to.be.true;
		});
		it('should return false for once transactions', () => {
			const transaction = new Transaction('someid', 'wages', 2333, 'Once', '2018-09-09');
			expect(transaction.isRecurring()).to.be.false;
		});
		it('should return false for sporadic transactions', () => {
			const transaction = new Transaction('someid', 'wages', 2333, 'Sporadic', '2018-09-09');
			expect(transaction.isRecurring()).to.be.false;
		});
	})
});
