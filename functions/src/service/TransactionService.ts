import * as moment from 'moment';
import Transaction from "../models/Transaction";
import Result from "../dto/Result";
import { fetchCollection } from '../util/Firestore';

export const getFutureIncomes =
	async (userId: string, months?: number, skip?: number): Promise<Result> => {
	console.log('getting future transactions for ', userId);
	const incomes: Result = await fetchCollection(`transactions/${userId}/incomes`);
	if(!incomes.success) return incomes;
	let results : Array<Transaction> = [];
	incomes.data.forEach(income => {
		console.log('iterating through fetched results');
		if(!income.isRecurring() && income.isFuture()) {
			console.log('income is non recurring and is in the future, adding single entity');
			results = results.concat([income])
		} else if(income.isRecurring()) {
			console.log('income is recurring, generating multiple entities');
			results = results.concat(getFutureTransactions(income, months, skip))
		}
	});
	console.log('entity generation complete, generated', results.length, 'entries');
	incomes.data = results;
	return incomes;
};

export const getFutureTransactions =
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


