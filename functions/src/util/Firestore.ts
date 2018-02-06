import { firestore } from 'firebase-admin';
import Result from "../dto/Result";
import {QuerySnapshot} from '@google-cloud/firestore';

export const fetchCollection = async (path: string): Promise<Result> => {
	console.log('attempting to get collection from path', path);
	const res = new Result();
	try{
		const snapshot =  await firestore().collection(path).get();
		res.status = 200;
		res.success = true;
		res.data = mapSnapshot(snapshot);
		return res;
	}catch(error) {
		res.status = 500;
		res.success = false;
		res.msg = 'an error occurred while fetching from firebase';
		res.error = error;
		return res;
	}
};

const mapSnapshot = (snapshot: QuerySnapshot) : Array<Object> => {
	const results = [];
	snapshot.forEach((doc: firestore.DocumentSnapshot) => {
		results.push(Object.assign({id: doc.id}, doc.data()))
	});
	return results;
};
