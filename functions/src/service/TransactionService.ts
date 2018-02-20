import * as moment from 'moment';
import Transaction from "../models/Transaction";
import Result from "../dto/Result";
import { fetchCollection } from '../util/Firestore';

export const getFutureIncomes =
	async (userId: string, months?: number, skip?: number): Promise<Result> => await fetchFutureTransactions(userId, 'Income', months, skip);
export const getFutureExpenditures = async (userId: string, months?: number, skip?: number): Promise<Result> => await fetchFutureTransactions(userId, 'Expenditure', months, skip);
export const getFutureTransactions = async (userId: string, months?: number, skip?: number): Promise<Result> => await fetchFutureTransactions(userId, 'all', months, skip);
export const fetchFutureTransactions = async(userId: string, type: 'Income' | 'Expenditure' | 'all', months?: number, skip?: number) : Promise<Result> => {
	console.log('getting future transactions for ', userId);
	const incomes: Result = await fetchFromDb(userId, type);
	if(!incomes.success) return incomes;
	console.log('result of fetching incomes:', incomes);
	let results : Array<Transaction> = [];
	incomes.data.forEach(income => {
		console.log('iterating through fetched results');
		const newIncome: Transaction = mapTransaction(income, type !== 'all' ? type : income.type);
		if(!newIncome.isRecurring() && newIncome.isFuture()) {
			console.log('income is non recurring and is in the future, adding single entity');
			results = results.concat([newIncome])
		} else if(newIncome.isRecurring()) {
			console.log('income is recurring, generating multiple entities');
			results = results.concat(generateFutureTransactions(newIncome, months, skip))
		}
	});
	console.log('entity generation complete, generated', results.length, 'entries');
	const mappedResults = results.map(result => result.mapForClient());
	incomes.data = mappedResults;
	return incomes;
};
const fetchFromDb = async (userId: string, type: 'Income' | 'Expenditure' | 'all'): Promise<Result> => {
	console.log('fetching', type, 'from db for', userId);
	const dbPath = type === 'Income' ? 'incomes' : 'expenditures';
	if(type !== 'all') return await fetchCollection(`transactions/${userId}/${dbPath}`);
	const incomes = await fetchCollection(`transactions/${userId}/incomes`);
	if(!incomes.success) return incomes;
	incomes.data = incomes.data.map(income => Object.assign({type: 'Income'}, income));
	console.log('new incomes', incomes);
	const expenditures = await fetchCollection(`transactions/${userId}/expenditures`);
	if (!expenditures.success) return expenditures;
	expenditures.data = expenditures.data.map(income => Object.assign({type: 'Expenditure'}, income));
	incomes.data = incomes.data.concat(expenditures.data);
	return incomes;
};
export const generateFutureTransactions =
	(transaction: Transaction, months: number = 3, skip: number = 0): Array<Transaction>  =>{
	console.log('attempting to get', months, 'months worth of transactions skipping', skip);
	if(!transaction.isRecurring() && transaction.isFuture()) return [transaction];
	if(!transaction.isRecurring() && !transaction.isFuture()) return [];
	let baseTransaction = getNextTransaction(transaction);
	if(skip > 0) baseTransaction.nextDueDate = incrementDate(baseTransaction.nextDueDate, baseTransaction.frequency, getIterations(skip, baseTransaction.frequency));
	const results = [baseTransaction];
	for(let i = 0; i < getIterations(months, transaction.frequency) -1; i++){
		const newTransaction = results[i].clone();
		newTransaction.nextDueDate = getNextDate(newTransaction.nextDueDate, newTransaction.frequency);
		results.push(newTransaction);
	}
	return results;
};
const getIterations =
	(months: number, frequency: string): number => {
	const INTERVALS = {
		Monthly: 1,
		Weekly: 4,
		Daily: 30
	};
	return months * INTERVALS[frequency];
};
const getNextTransaction =
	(transaction: Transaction): Transaction => {
	if(transaction.isFuture()) return transaction;
	let prevTransaction: Transaction = transaction;
	while(true){
		const newTransaction = prevTransaction.clone();
		newTransaction.nextDueDate = getNextDate(newTransaction.nextDueDate, newTransaction.frequency);
		if(newTransaction.isFuture()) return newTransaction;
		prevTransaction = newTransaction;
	}
};

export const getNextDate = (date: string, frequency: string): string => {
	console.log('getting next date from', date, 'with frequency', frequency);
	return incrementDate(date, frequency);
};

const incrementDate = (date: string, frequency: string, amount: number = 1): string => {
	const INTERVALS = {
		Monthly: 'months',
		Weekly: 'weeks',
		Daily: 'days'
	};
	console.log('incrementing', date, 'by', amount, INTERVALS[frequency]);
	return moment(date).add(amount, INTERVALS[frequency]).format('YYYY-MM-DD');
};
export const mapTransactions = (transactionList: Array<{id:string, frequency: string, amount: number, nextDueDate: string, title: string}>, type: 'Income' | 'Expenditure'): Array<Transaction> => transactionList.map(transaction => mapTransaction(transaction, type));
export const mapTransaction =  (transactionObj: {id:string, frequency: string, amount: number, nextDueDate: string, title: string}, type: 'Income' | 'Expenditure'): Transaction => {
	console.log('converting', transactionObj, 'to a transaction object of type', type);
	return new Transaction(transactionObj.id, transactionObj.title, transactionObj.amount, transactionObj.frequency, transactionObj.nextDueDate, type)
};


