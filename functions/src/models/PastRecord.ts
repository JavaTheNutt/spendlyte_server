export default class PastRecord {
	private _date: string;
	private _budgeted: number;
	private _actual: number;
	private _completed: boolean;

	constructor(date: string, budgeted: number, actual?: number, completed: boolean = false) {
		this._date = date;
		this._budgeted = budgeted;
		this._actual = actual;
		this._completed = completed;
	}


	get date(): string {
		return this._date;
	}

	set date(value: string) {
		this._date = value;
	}

	get budgeted(): number {
		return this._budgeted;
	}

	set budgeted(value: number) {
		this._budgeted = value;
	}

	get actual(): number {
		return this._actual;
	}

	set actual(value: number) {
		this._actual = value;
	}

	get completed(): boolean {
		return this._completed;
	}

	set completed(value: boolean) {
		this._completed = value;
	}
	getDifference() {
		return !this.actual ? 0 : this.budgeted - this.actual
	}
	formatForSaving () {
		const data =  {
			date: this._date,
			budgeted: this._budgeted,
			actual: this.actual,
			completed: this.completed
		};
		if(!data.actual) delete data.actual;
		return data;
	}
	formatForDelivery () {
		return Object.assign({difference: this.getDifference()}, this.formatForSaving())
	}
}
