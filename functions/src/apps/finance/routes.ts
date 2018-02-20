import { Application, Response } from "express";
import { IRequest } from "../../../types/c_express";
import { getFutureIncomes, getFutureExpenditures, getFutureTransactions } from '../../service/TransactionService'
export default (app: Application) => {
	app.get('/income', async (req: IRequest, res: Response) => {
		console.log('request recieved to fetch all future incomes');
		const result = await getFutureIncomes(req.user.uid, req.query.num, req.query.skip);
		console.log('result', result);
		res.status(result.success ? 200: 500).send(result.data);
	});
	app.get('/expenditure', async (req: IRequest, res: Response) => {
		console.log('request recieved to fetch all future expenditures');
		const result = await getFutureExpenditures(req.user.uid, req.query.num, req.query.skip);
		console.log('result', result);
		res.status(result.success ? 200: 500).send(result.data);
	});
	app.get('/all', async (req: IRequest, res: Response) => {
		console.log('request recieved to fetch all future expenditures');
		const result = await getFutureTransactions(req.user.uid, req.query.num, req.query.skip);
		console.log('result', result);
		res.status(result.success ? 200: 500).send(result.data);
	})
}
