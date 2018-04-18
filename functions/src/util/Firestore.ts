import {firestore} from 'firebase-admin';
import Result from "../dto/Result";
import {QuerySnapshot, CollectionReference, DocumentSnapshot} from '@google-cloud/firestore';

export const fetchCollection = async (path: string): Promise<Result> => {
	console.log('attempting to get collection from path', path);
	const res = new Result();
	try {
		const snapshot = await firestore().collection(path).get();
		res.status = 200;
		res.success = true;
		res.data = mapSnapshot(snapshot);
		return res;
	} catch (error) {
		res.status = 500;
		res.success = false;
		res.msg = 'an error occurred while fetching from firebase';
		res.error = error;
		return res;
	}
};
export const fetchDocument = async (path: string): Promise<Result> => {
	console.log('path to be fetched', path);
	const collectionPath = path.substring(0, path.lastIndexOf('/'));
	const docPath = path.substring(path.lastIndexOf('/'));
	console.log('fetching document', docPath, 'at location', collectionPath);
	const res = new Result();
	try {
		const snapshot = await fetchCollectionReference(collectionPath).doc(docPath).get();
		res.status = 200;
		res.success = true;
		res.data = [Object.assign({id: snapshot.id}, snapshot.data())];
		return res;
	} catch (error) {
		res.status = 500;
		res.success = false;
		res.msg = 'an error occurred while fetching from firebase';
		res.error = error;
		return res;
	}
};

const fetchCollectionReference = (path: string): CollectionReference => {
	console.log('returning reference at path', path);
	return firestore().collection(path);
};

export const mapSnapshot = (snapshot: QuerySnapshot): Array<Object> => {
	const results = [];
	snapshot.forEach((doc: firestore.DocumentSnapshot) => {
		results.push(Object.assign({id: doc.id}, doc.data()))
	});
	return results;
};
export const updateDoc = async (path: string, newParams: Object): Promise<Result> => {
	console.log('addding params', newParams, 'to doc at path', path);
	const collectionPath = path.substring(0, path.lastIndexOf('/'));
	const docId = path.substring(path.lastIndexOf('/'));
	console.log('attempting to update', docId, 'in collection', collectionPath);
	const res = new Result();
	try {
		await firestore().collection(collectionPath).doc(docId).set(newParams, {merge: true});
		console.log('result of updating doc', res);
		res.status = 200;
		res.success = true;
		res.data = [];
		return res;
	} catch (err) {
		res.status = 500;
		res.success = false;
		res.msg = 'an error occurred while fetching from firebase';
		res.error = err;
		return res;
	}
};

export const deleteFields = (path: string, fields: Array<string>): Promise<Result> => {
	return new Promise((resolve, reject) => {
		console.log('attempting to delete fields', fields, 'from path', path);
		const deletePromises = [];
		const queryParts = fetchDocQueryParts(path);
		const docRef = firestore().collection(queryParts.path).doc(queryParts.docId);
		const res = new Result();
		fields.forEach(field => {
			deletePromises.push(docRef.update({
				[field]: firestore.FieldValue.delete()
			}));
		});
		console.log('all delete events dispatched');
		Promise.all(deletePromises).then(() => {
			console.log('all delete events completed');
			res.status = 200;
			res.success = true;
			res.data = [];
			resolve(res);
		}).catch(err => {
			console.log('error deleting fields', err);
			res.status = 500;
			res.success = false;
			res.msg = 'an error occurred while fetching from firebase';
			res.error = err;
			reject(res);
		});
	});
};

const fetchDocQueryParts = (path: string): { path: string, docId: string } => {
	const collectionPath = path.substring(0, path.lastIndexOf('/'));
	const docId = path.substring(path.lastIndexOf('/'));
	return {path: collectionPath, docId}
};


