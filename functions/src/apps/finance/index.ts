import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import routes from './routes';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { validateFirebaseIdToken} from "../../middleware/Auth";

export default class Server {
	public app: express.Application;

	public static bootstrap (): Server {
		console.log('bootstrapping finance application');
		return new Server();
	}

	constructor() {
		console.log('constructing application');
		this.app = express();
		this.config();
		this.middleware();
		this.routes();
		admin.initializeApp(functions.config().firebase);
	}

	public config () {
		console.log('configuring application');
		this.app.use(cors({origin: true}));
		this.app.use(cookieParser());
	}

	public routes () {
		console.log('fetching routes');
		routes(this.app)
	}
	public middleware () {
		console.log('configuring middleware');
		if(process.env.NODE_ENV !== 'development') {
			console.log('production mode detected, adding auth middleware');
			this.app.use(validateFirebaseIdToken);
		}
	}
}


