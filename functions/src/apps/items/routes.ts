import {Application, Response} from "express";
import {IRequest} from "../../../types/c_express";
import { saveNewItem, fetchForDelivery } from "../../service/ItemService";
import Result from "../../dto/Result";
import Item from "../../models/Item";

export default (app: Application) => {
	app.post('/', (req: IRequest, res: Response) => {
		console.log('request recieved to fetch all tags for user', req.user.uid);
		saveNewItem(req.user.uid, createItemIn(req.body.item)).then((result: Result) => {
			console.log('result', result);
			res.status(result.status || result.success ? 200 : 500).send(result.data[0]);
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
		fetchForDelivery(req.user.uid, amountDetails, req.query.verbose, !!req.query.months).then(result => {
			console.log('data fetched successfully');
			res.status(result.status || result.success ? 200 : 500).send(result.data);
		}).catch(err => {
			console.log('an error has occurred', err);
			res.status(500).send({msg: 'an error has occurred while fetching items'})
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
