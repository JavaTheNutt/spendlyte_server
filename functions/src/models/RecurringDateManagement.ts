import DateManagement from './DateManagement';
import * as addDays from 'date-fns/add_days';
import * as addWeeks from 'date-fns/add_weeks';
import * as addMonths from 'date-fns/add_months';
import * as format from 'date-fns/format';

export enum Frequency {
	monthly = 'MONTHLY',
	weekly = 'WEEKLY',
	daily = 'DAILY'
}


export default class RecurringDateManagement extends DateManagement {
	protected _frequency: Frequency;
	protected _interval: number;

	constructor(dates: Array<string>, frequency: Frequency, interval: number = 1) {
		super(true, dates);
		this._frequency = frequency;
		this._interval = interval;
	}

	get frequency(): Frequency {
		return this._frequency;
	}

	set frequency(value: Frequency) {
		this._frequency = value;
	}

	get interval(): number {
		return this._interval;
	}

	set interval(value: number) {
		this._interval = value;
	}

	getNextDates(amount: number = 1, refresh: boolean= false): Array<string> {
		console.log('attempting to generate', amount, 'records');
		if(refresh) super.resetGeneratedDates();
		let lastDate = this.getLatestDate();
		let addDateFn: Function;
		switch (this._frequency) {
			case Frequency.daily:
				addDateFn = addDays;
				break;
			case Frequency.weekly:
				addDateFn = addWeeks;
				break;
			case Frequency.monthly:
				addDateFn = addMonths;
		}
		for (let i = 0; i < amount; i++) {
			const newLastDate = addDateFn(lastDate, this._interval);
			this._dates.push(format(newLastDate, 'YYYY-MM-DD'));
			this._dateDetails.push({date: newLastDate, userEntered: false});
			lastDate = newLastDate;
		}
		return this._dates;
	}

	getNextDatesForMonths(amount: number = 1, refresh: boolean = false): Array<string>{
		console.log('attempting to generate', (getNumberTransactionsPerMonth(this._frequency) * amount)/this._interval, 'transactions over a', amount, 'month period');
		return this.getNextDates(Math.ceil((getNumberTransactionsPerMonth(this._frequency) * amount)/this._interval))
	}

	formatForSaving() {
		console.log('format for saving called in the recurring date object');
		return Object.assign(super.formatForSaving(), {
			frequency: this.frequency,
			interval: this.interval
		});
	}
	formatForDelivery(amount: number = 0, verbose: boolean = false, months: boolean = false, refresh?: boolean){
		console.log('format for delivery called in a recurring date instance. fetching months?', months);
		if(months){
			console.log('fetching', amount, 'months worth of records');
			this.getNextDatesForMonths(amount, refresh);
		}else{
			console.log('fetching', amount, 'records');
			this.getNextDates(amount, refresh);
		}
		const superBase = super.formatForDelivery(amount, verbose, months);
		return verbose? Object.assign(superBase, {
			interval: this.interval,
			frequency: this.frequency
		}): superBase;
	}
}

const getNumberTransactionsPerMonth = (frequency: string):number => {
	switch (frequency.toLowerCase()) {
		case 'weekly':
			return 4;
		case 'monthly':
			return 1;
		default:
			return 30;
	}
};

