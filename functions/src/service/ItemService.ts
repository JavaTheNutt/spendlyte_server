import {firestore} from 'firebase-admin';
import Item from "../models/Item";
import Result from "../dto/Result";
import {mapSnapshot} from "../util/Firestore";
import DateManagement from "../models/DateManagement";
import ItemList from "../models/ItemList";

export const saveNewItem = async (userId:string, item: Item): Promise<Result> => {
	const result = new Result();
	try {
		const res = await (await firestore().collection(`items/${userId}/records`).add(item.formatForSaving())).get();
		result.status = 200;
		result.data = [Object.assign({id: res.id}, res.data())];
		return result;
	}catch(err){
		console.log('an error has occurred writing to firebase', err);
		result.status = 500;
		result.msg = 'a network error has occurred';
		result.error = err;
		return result;
	}
};
export const fetchForDelivery = async (userId: string, amount: number = 0, verbose:boolean = false, months?: boolean) => {
	console.log('fetching for months in fetch function?', months);
	const res = await fetchItems(userId);
	if(!res.success) return res;
	res.data = mapForDelivery(res.data, amount, verbose, months);
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
export const fetchItems = async (userId:string): Promise<Result> => {
	const result = new Result();
	try{
		const res = await firestore().collection(`items/${userId}/records`).get();
		const objectMappedResults = mapSnapshot(res);
		//console.log('result mapped as object',objectMappedResults);
		const itemMappedResults = objectMappedResults.map(item => mapItem(item));
		//console.log('result mapped as item',itemMappedResults);
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
	return new Item(itemDetails.title, itemDetails.amount, itemDetails.isIncome ? 1 : -1, dateDetails, itemDetails.tags, itemDetails.id)
};

export const mapForDelivery = (items: Array<Item>, amount:number = 0, verbose:boolean=false, months?:boolean) => {
	console.log('generating months in map function?', true);
	return items.map(item => item.formatForDelivery(amount, verbose, months));
};



