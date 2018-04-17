import {Application, Response} from "express";
import {IRequest} from "../../../types/c_express";
import { saveNewItem } from "../../service/ItemService";
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
		type: details.type
	}, details.tags)
};
