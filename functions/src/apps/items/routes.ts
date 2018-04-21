import {Application, Response} from "express";
import {IRequest} from "../../../types/c_express";
import {saveNewItem, fetchForDelivery, fetchSummary, updatePastRecord} from "../../service/ItemService";
import Result from "../../dto/Result";
import Item from "../../models/Item";
import {addNewTags} from "../../service/TagService";

export default (app: Application) => {
	app.post('/', (req: IRequest, res: Response) => {
		console.log('request recieved to fetch all tags for user', req.user.uid);
		const promises = [saveNewItem(req.user.uid, createItemIn(req.body.item)), addNewTags(req.user.uid, req.body.item.tags)];
		Promise.all(promises).then(result => {
			console.log('result', result);
			res.status(result[0].success ? 200 : 500).send(result[0].data[0]);
		}).catch(err => {
			console.log('an error has occurred', err);
			res.status(500).send({msg: 'an error has occurred while fetching tags'})
		});
	});
	app.get('/', (req: IRequest, res: Response) => {
		console.log('request recieved to fetch all items for user', req.user.uid, 'with params', req.query);
		const amountDetails = req.query.amount || req.query.months || 0;
		const logStr = !!req.query.months ? `attempting to fetch ${req.query.months} months worth of records` : `attempting to fetch ${req.query.amount} records`;
		console.log(logStr);
		const allShown = !req.query.records && !req.query.dates && !req.query.verbose;
		if(allShown){
			console.log('no params found, fetching all');
			req.query.verbose = true;
			req.query.records = true;
			req.query.dates = true;
		}
		fetchForDelivery(req.user.uid, amountDetails, req.query.verbose, !!req.query.months, req.query.records, req.query.dates).then(result => {
			console.log('data fetched successfully');
			res.status(result.status || result.success ? 200 : 500).send(result.data);
		}).catch(err => {
			console.log('an error has occurred', err);
			res.status(500).send({msg: 'an error has occurred while fetching items'})
		})
	});
	app.get('/summary', (req: IRequest, res: Response) => {
		console.log('attempting to fetch summary stats for user', req.user.uid);
		fetchSummary(req.user.uid, req.query.list).then(result => {
			res.status(result.status || result.success ? 200 : 500).send(result.data[0]);
		}).catch(err => {
			console.log('an error has occurred', err);
			res.status(500).send({msg: 'an error has occurred while fetching summary'})
		})
	});
	app.put('/past/:docId/:recordId', (req: IRequest, res: Response) => {
		console.log('attempting to update doc', req.params.docId, 'record', req.params.recordId);
		updatePastRecord(req.user.uid, req.params.docId, req.params.recordId, req.body).then(() => {
			res.status(200).send('updated successfully');
		}).catch(err => {
			console.log('an error has occurred', err);
			res.status(500).send({msg: 'an error has occurred while updating record'})
		})
	})
}

const createItemIn = (details): Item => {
	console.log('attempting to create item object from details', details);
	return new Item(details.title, details.amount, details.isIncome ? 1 : -1, {
		isRecurring: details.isRecurring,
		dates: details.dates,
		frequency: details.frequency,
		interval: details.interval,
		freq01: details.freq01,
		freq02: details.freq02,
		type: details.type,
	}, details.tags)
};
