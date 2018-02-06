export default class Result {
	private _success: boolean;
	private _data: Array<any>;
	private _status: number;
	private _error: Error;
	private _msg: string;

	constructor(success?: boolean, data?: Array<any>, status?: number, error?: Error, msg?: string) {
		this._success = success;
		this._data = data;
		this._status = status;
		this._error = error;
		this._msg = msg;
	}

	get success(): boolean {
		return this._success;
	}

	set success(value: boolean) {
		this._success = value;
	}

	get data(): Array<any> {
		return this._data;
	}

	set data(value: Array<any>) {
		this._data = value;
	}

	get status(): number {
		return this._status;
	}

	set status(value: number) {
		this._status = value;
	}

	get error(): Error {
		return this._error;
	}

	set error(value: Error) {
		this._error = value;
	}

	get msg(): string {
		return this._msg;
	}

	set msg(value: string) {
		this._msg = value;
	}
}
