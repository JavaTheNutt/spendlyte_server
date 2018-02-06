import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import routes from './routes';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export default class Server {
	public app: express.Application;

	public static bootstrap (): Server {
		return new Server();
	}

	constructor() {
		this.app = express();
		this.config();
		this.routes();
		admin.initializeApp(functions.config().firebase);
	}

	public config () {
		this.app.use(cors({origin: true}));
		this.app.use(cookieParser());
	}

	public routes () {
		routes(this.app)
	}
}


