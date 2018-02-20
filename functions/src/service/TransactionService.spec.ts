import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { generateFutureTransactions, getNextDate, getFutureIncomes } from './TransactionService';
import * as FirebaseUtil from '../util/Firestore';
import 'mocha';
import * as moment from 'moment';
import Transaction from "../models/Transaction";
import Result from "../dto/Result";

chai.use(sinonChai);
const expect = chai.expect;
const sandbox = sinon.sandbox.create();
describe('TransactionService', () => {
	afterEach(() => sandbox.restore())
	describe('generateFutureTransactions', () => {
		it('should return 12 Weekly transactions by default', () => {
			const transaction = new Transaction('something', 'wages', 2300, 'Weekly', moment().format('YYYY-MM-DD'));
			const transactionList = generateFutureTransactions(transaction);
			expect(transactionList.length).to.equal(12);
		});
		it('should return 3 Monthly transactions by default', () => {
			const transaction = new Transaction('something', 'wages', 2300, 'Monthly', moment().format('YYYY-MM-DD'));
			const transactionList = generateFutureTransactions(transaction);
			expect(transactionList.length).to.equal(3);
		});
		it('should return 90 Daily transactions by default', () => {
			const transaction = new Transaction('something', 'wages', 2300, 'Daily', moment().format('YYYY-MM-DD'));
			const transactionList = generateFutureTransactions(transaction);
			expect(transactionList.length).to.equal(90);
		});
		it('should return 4 Weekly transactions when one month is specified', () => {
			const transaction = new Transaction('something', 'wages', 2300, 'Weekly', moment().format('YYYY-MM-DD'));
			const transactionList = generateFutureTransactions(transaction, 1);
			expect(transactionList.length).to.equal(4);
		});
		it('should return 1 Monthly transactions when one month is specified', () => {
			const transaction = new Transaction('something', 'wages', 2300, 'Monthly', moment().format('YYYY-MM-DD'));
			const transactionList = generateFutureTransactions(transaction, 1);
			expect(transactionList.length).to.equal(1);
		});
		it('should return 30 Daily transactions when one month is specified', () => {
			const transaction = new Transaction('something', 'wages', 2300, 'Daily', moment().format('YYYY-MM-DD'));
			const transactionList = generateFutureTransactions(transaction, 1);
			expect(transactionList.length).to.equal(30);
		});
		it('should return only future transactions', () => {
			const transaction = new Transaction('something', 'wages', 2300, 'Daily', moment().subtract(10, 'days').format('YYYY-MM-DD'));
			const transactionList = generateFutureTransactions(transaction, 1);
			expect(moment(transactionList[0].nextDueDate).isSameOrAfter(moment().subtract(1, 'day'))).to.be.true;
		});
		it('should skip the specified number of months', () => {
			const transaction = new Transaction('something', 'wages', 2300, 'Daily', moment().format('YYYY-MM-DD'));
			const transactionList = generateFutureTransactions(transaction, 1, 3);
			expect(moment(transactionList[0].nextDueDate)
				.isSameOrAfter(moment().add(9, 'weeks'))).to.be.true;
		});
		it('should return sporadic transactions wrapped in an array when they are in the future', () => {
			const transaction = new Transaction('something', 'wages', 2300, 'Sporadic', moment().add(1, 'day').format('YYYY-MM-DD'));
			const transactionList = generateFutureTransactions(transaction);
			expect(transactionList).to.eql([transaction]);
		});
		it('should return an empty array when sporadic transactions are not in the future', () => {
			const transaction = new Transaction('something', 'wages', 2300, 'Sporadic', moment().subtract(1, 'day').format('YYYY-MM-DD'));
			const transactionList = generateFutureTransactions(transaction);
			expect(transactionList).to.eql([]);
		});
		it('should return once transactions wrapped in an array', () => {
			const transaction = new Transaction('something', 'wages', 2300, 'Once', moment().add(1, 'day').format('YYYY-MM-DD'));
			const transactionList = generateFutureTransactions(transaction);
			expect(transactionList).to.eql([transaction]);
		});
		it('should return an empty array when once transactions are not in the future', () => {
			const transaction = new Transaction('something', 'wages', 2300, 'Once', moment().subtract(1, 'day').format('YYYY-MM-DD'));
			const transactionList = generateFutureTransactions(transaction);
			expect(transactionList).to.eql([]);
		});
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
	});
	describe('getFutureIncomes', ()=>{
		let fetchCollectionStub;
		beforeEach(() => {
			const transaction = new Transaction('someid', 'wages', 4500, 'Monthly', moment().add(1, 'days').format('YYYY-MM-DD'));
			const transaction2 = new Transaction('someid', 'wages', 4500, 'Weekly', moment().add(1, 'days').format('YYYY-MM-DD'));
			fetchCollectionStub = sandbox.stub(FirebaseUtil, 'fetchCollection');
			const result = new Result();
			result.data = [transaction, transaction2];
			result.success = true;
			fetchCollectionStub.resolves(result);
		});
		it('should generate a list of transactions based on the results of the db query', async () => {
			const resultList : Result = await getFutureIncomes('someuserid');
			expect(resultList.data.length).to.equal(15);
		});
		it('should respect the number parameter', async () => {
			const resultList : Result = await getFutureIncomes('someuserid', 1);
			expect(resultList.data.length).to.equal(5);
		});
		it('should respect the skip parameter', async () => {
			const resultList : Result = await getFutureIncomes('someuserid', 1, 4);
			expect(moment(resultList.data[0].nextDueDate).isSameOrAfter(moment().add(3, 'months'))).to.be.true;
		})
	})
});
