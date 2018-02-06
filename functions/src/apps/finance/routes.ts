import { Application, Request, Response } from "express";

export default (app: Application) => {
	app.get('/', (req: Request, res: Response) => {
		res.status(200).send('working');
	})
}
