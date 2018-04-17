import * as moment from 'moment';
import {titleCaseString} from "../util/String";

export default class Transaction {
	private _id: string;
	private _title: string;
	private _amount: number;
	private _frequency: string;
	private _nextDueDate: string;
	private _type: 'Income' | 'Expenditure';


	constructor(id?: string, title?: string, amount?: number, frequency?: string, nextDueDate?: string, type?: 'Income' | 'Expenditure') {
		this._id = id;
		this._title = title;
		this._amount = amount;
		this._frequency = frequency;
		this._nextDueDate = nextDueDate;
		this._type = type;
	}


	get id(): string {
		return this._id;
	}

	set id(value: string) {
		this._id = value;
	}

	get title(): string {
		return this._title;
	}

	set title(value: string) {
		this._title = value;
	}

	get amount(): number {
		return this._amount;
	}

	set amount(value: number) {
		this._amount = value;
	}

	get frequency(): string {
		return this._frequency;
	}

	set frequency(value: string) {
		this._frequency = value;
	}

	get nextDueDate(): string {
		return this._nextDueDate;
	}

	get type() {
		return this._type;
	}

	set type(value) {
		this._type = value;
	}

	set nextDueDate(value: string) {
		this._nextDueDate = value;
	}

	public isFuture(): boolean {
		const date = moment(this.nextDueDate);
		return date.isSameOrAfter(moment());
	}

	public clone(): Transaction {
		return new Transaction(this.id, this.title, this.amount, this.frequency, this.nextDueDate, this.type)
	}

	public mapForClient(): { id: string, title: string, amount: number, frequency: string, due: string, type: string } {
		return {
			id: this.id,
			title: titleCaseString(this.title),
			amount: this.amount,
			frequency: titleCaseString(this.frequency),
			due: this.nextDueDate,
			type: this.type
		}
	}

	public isRecurring(): boolean {
		return this.frequency === 'Daily' || this.frequency === 'Weekly' || this.frequency === 'Monthly';
	}
}
