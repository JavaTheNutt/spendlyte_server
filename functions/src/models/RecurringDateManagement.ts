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

	getNextDates(amount: number = 1): Array<string> {
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
	formatForSaving() {
		console.log('format for saving called in the recurring date object');
		return Object.assign(super.formatForSaving(), {
			frequency: this.frequency,
			interval: this.interval
		});
	}
	formatForDelivery(amount: number = 0, verbose: boolean = false){
		this.getNextDates(amount);
		const superBase = super.formatForDelivery(amount, verbose);
		return verbose? Object.assign(superBase, {
			interval: this.interval,
			frequency: this.frequency
		}): superBase;
	}
}

