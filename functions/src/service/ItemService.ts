import {firestore} from 'firebase-admin';
import Item from "../models/Item";
import Result from "../dto/Result";

export const saveNewItem = async (userId:string, item: Item): Promise<Result> => {
	const result = new Result();
	try {
		const res = await (await firestore().collection(`items/${userId}/records`).add(item.formatForSaving())).get();
		result.status = 200;
		result.data = [Object.assign({id: res.id}, res.data())];
		//console.log(res);
		return result;
	}catch(err){
		console.log('an error has occurred writing to firebase', err);
		result.status = 500;
		result.msg = 'a network error has occurred';
		result.error = err;
		return result;
	}
};
