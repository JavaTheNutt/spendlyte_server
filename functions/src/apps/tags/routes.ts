import {Application, Response} from "express";
import {IRequest} from "../../../types/c_express";
import Result from "../../dto/Result";

export default (app: Application) => {
	/*app.get('/', (req: IRequest, res: Response) => {
		console.log('request recieved to fetch all tags for user', req.user.uid);
		fetchTags(req.user.uid).then((result: Result) => {
			console.log('result', result);
			res.status(result.status || result.success ? 200 : 500).send(result.data[0]);
		}).catch(err => {
			console.log('an error has occurred', err);
			res.status(500).send({msg: 'an error hass occurred while fetching tags'})
		});
	});*/
	app.post('/', (req: IRequest, res: Response) => {
		console.log('attempting to add', req.body, 'item to user', req.user.uid);
	});
	/*app.delete('/', (req: IRequest, res: Response) => {
		console.log('attempting to remove', req.body, 'tags from user', req.user.uid);
		removeTags(req.user.uid, req.body.tags).then(result => {
			console.log('result', result);
			res.status(result.status || result.success ? 200 : 500).send({msg: 'tag updated successfully'});
		}).catch(err => {
			console.log('an error has occurred', err);
			res.status(500).send({msg: 'an error hass occurred while updating tags'})
		});
	})*/
}
