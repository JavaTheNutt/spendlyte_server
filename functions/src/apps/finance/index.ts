import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import routes from './routes';
export default class Server {
	public app: express.Application;

	public static bootstrap (): Server {
		return new Server();
	}

	constructor() {
		this.app = express();
		this.config();
		this.routes();
	}

	public config () {
		this.app.use(cors({origin: true}));
		this.app.use(cookieParser());
	}

	public routes () {
		routes(this.app)
	}
}







/*import * as express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cors({origin: true}));
app.use(cookieParser());

app.listen(3000, () => console.log('app started on port 3000'));

export default app;*/

