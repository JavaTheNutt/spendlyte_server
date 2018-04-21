import {firestore} from 'firebase-admin';
import Item from "../models/Item";
import Result from "../dto/Result";
import {mapSnapshot} from "../util/Firestore";
import DateManagement from "../models/DateManagement";
import ItemList from "../models/ItemList";
import PastRecord from "../models/PastRecord";
import PastRecords from "../models/PastRecords";

export const saveNewItem = async (userId:string, item: Item): Promise<Result> => {
	console.log('attempting to save new item');
	const result = new Result();
	try {
		const pastList  = Object.assign([], item.pastRecords.records);
		const res = await (await firestore().collection(`items/${userId}/records`).add(item.formatForSaving())).get();
		await addPastRecords(userId, res.id, pastList);
		result.success = true;
		result.status = 200;
		result.data = [Object.assign({id: res.id}, res.data())];
		return result;
	}catch(err){
		console.log('an error has occurred writing to firebase', err);
		result.success = false;
		result.status = 500;
		result.msg = 'a network error has occurred';
		result.error = err;
		return result;
	}
};
export const addPastRecords = (userId: string, docId: string, docs: Array<PastRecord>) => {
	console.log('attempting to add past records');
	const promises = [];
	docs.forEach(doc => {
		console.log('attempting to add', doc, 'to collection');
		const formattedDoc = doc.formatForSaving();
		console.log('formatted doc',formattedDoc);
		promises.push(firestore().collection(`items/${userId}/records/${docId}/past`).add(formattedDoc));
	});
	return new Promise((resolve, reject) => Promise.all(promises).then(() => resolve()).catch(err => reject(err)))

};
export const fetchForDelivery = async (userId: string, amount: number = 0, verbose:boolean = false, months: boolean = false, records: boolean = false, dates:boolean = false) => {
	console.log('fetching for months in fetch function?', months);
	const res = await fetchItems(userId, records);
	if(!res.success) return res;
	console.log('res', res);
	res.data = mapForDelivery(res.data, amount, verbose, months, records, dates);
	return res;
};

export const fetchSummary= async(userId: string, list?: boolean): Promise<Result> => {
	console.log('attempting to fetch summary stats');
	const items = await fetchItems(userId);
	if(!items.success) return items;
	console.log('items fetched without error');
	items.data = [new ItemList(items.data).generateSummary(list)];
	return items;
};
export const fetchAllPast = async (userId:string, items:Array<Item>): Promise<Result> => {
	const newItems = [];
	for (let i = 0; i < items.length; i++) {
		const res = await fetchPast(userId, items[i]);
		if(!res.success) return res;
		newItems.concat(res.data);
	}
	return new Result(true, newItems, 200);
};
export const fetchPast = async (userId: string, item: Item) => {
	console.log('attempting to fetch past records for user', userId, 'from doc', item.id);
	const result = new Result();
	try{
		const res = await firestore().collection(`items/${userId}/records/${item.id}/past`).get();
		const objMappedResults = mapSnapshot(res);
		console.log('fetched past records:', objMappedResults);
		const recordMappedResults = objMappedResults.map(record => mapRecord(record));
		console.log('mapped past records:', recordMappedResults);
		item.pastRecords = new PastRecords(recordMappedResults);
		result.status = 200;
		result.data = [item];
		result.success = true;
		return result;
	}catch (error){
		console.log('an error has occurred fetching past records');
		result.success = false;
		result.status = 500;
		result.error = error;
		result.msg = 'an error occurred while fetching records';
		return result;
	}
};
export const fetchItems = async (userId:string, records: boolean = false): Promise<Result> => {
	const result = new Result();
	try{
		const res = await firestore().collection(`items/${userId}/records`).get();
		const objectMappedResults = mapSnapshot(res);
		//console.log('result mapped as object',objectMappedResults);
		const itemMappedResults = objectMappedResults.map(item => mapItem(item));
		if(records){
			console.log('fetching past records');
			const pastRes = await fetchAllPast(userId, itemMappedResults);
			if(!pastRes.success) return pastRes;
		}
		result.success = true;
		result.status = 302;
		result.data = itemMappedResults;
		return result;
	} catch (error){
		result.success = false;
		result.status = 500;
		result.error = error;
		result.msg = 'an error occurred while fetching records';
		return result;
	}
};

export const mapItem = (itemDetails:any):Item => {
	//console.log('attempting to create item from details', itemDetails);
	const dateDetails = {
		isRecurring: !!itemDetails.dates.frequency,
		dates: itemDetails.dates.dates,
		frequency: itemDetails.dates.frequency,
		interval: itemDetails.dates.interval,
		freq01: itemDetails.dates.freq01,
		freq02: itemDetails.dates.freq02,
		type: itemDetails.dates.freqType
	};
	return new Item(itemDetails.title, itemDetails.amount, itemDetails.isIncome ? 1 : -1, dateDetails, itemDetails.tags,null, itemDetails.id)
};
export const mapItemWithRecords = async (userId: string, itemDetails: any) => {
	console.log('attempting to map item, with past records, for user', userId);
	console.log('details:', itemDetails);
	const dateDetails = {
		isRecurring: !!itemDetails.dates.frequency,
		dates: itemDetails.dates.dates,
		frequency: itemDetails.dates.frequency,
		interval: itemDetails.dates.interval,
		freq01: itemDetails.dates.freq01,
		freq02: itemDetails.dates.freq02,
		type: itemDetails.dates.freqType
	};
	const records = await fetchPast(userId, itemDetails.id);
	if(!records.success) return records;
	console.log('records fetched:', records.data.length);
	console.log('details:', records.data);
	const recordData = records.data.map(record => mapRecord(record));
	records.data = [new Item(itemDetails.title, itemDetails.amount, itemDetails.isIncome ? 1 : -1, dateDetails, itemDetails.tags,new PastRecords(recordData), itemDetails.id)];
	return records;
};

export const mapRecord = (recordDetails:any) => new PastRecord(recordDetails.date, recordDetails.budgeted, recordDetails.actual, recordDetails.completed, recordDetails.id);

export const updatePastRecord = async (userId: string, docId: string, recordId: string, newData: any) => {
	const result = new Result();
	console.log('attempting to update past record with id', recordId, 'in doc', docId, 'for user', userId);
	console.log('new details', newData);
	try {
		await firestore().doc(`items/${userId}/records/${docId}/past/${recordId}`).set(newData, {merge: true});
		result.success = true;
		result.status = 200;
		result.data = [];
		return result;
	}catch (error){
		console.log('error while updating past record, error:', error);
		result.success = false;
		result.status = 500;
		result.error = error;
		result.msg = 'an error occurred while updating past record';
		return result;
	}
};

export const mapForDelivery = (items: Array<Item>, amount:number = 0, verbose:boolean=false, months:boolean = false, records: boolean = false, dates:boolean=false) => {
	console.log('generating months in map function?', true);
	return items.map(item => item.formatForDelivery(amount, verbose, months, records, dates));
};



