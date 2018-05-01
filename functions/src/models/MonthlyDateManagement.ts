import RecurringDateManagement, {Frequency} from './RecurringDateManagement';
import * as addMonths from 'date-fns/add_months';
import * as addWeeks from 'date-fns/add_weeks';
import * as format from 'date-fns/format';
import * as startOfMonth from 'date-fns/start_of_month';
import * as endOfMonth from 'date-fns/end_of_month';
import * as setDate from "date-fns/set_date";
import * as setDay from 'date-fns/set_day';
import * as getDaysInMonth from 'date-fns/get_days_in_month';


export enum MonthlyFrequencyType {
	INTERVAL = 'inv',
	DAY_IN_MONTH = 'dim',
	WEEKDAY_IN_MONTH = 'wdim'
}

type weekdays = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
type monthWeeks = 'first' | 'second' | 'third' | 'last';
const weekDayMappings = {
	sunday: 0,
	monday: 1,
	tuesday: 2,
	wednesday: 3,
	thursday: 4,
	friday: 5,
	saturday: 6
};
export default class MonthlyDateManagement extends RecurringDateManagement {
	private _type: MonthlyFrequencyType;
	private _freq01: string;
	private _freq02: string;

	constructor(dates: Array<string>, freq01: string, freq02?: string, type: MonthlyFrequencyType = MonthlyFrequencyType.INTERVAL, interval: number = 1) {
		super(dates, Frequency.monthly, interval);
		this._type = type;
		if (freq01) {
			this._freq01 = freq01;
			this._freq02 = freq02;
		} else {
			const freqData = setDefaultFrequencyValues(this._type);
			this._freq01 = freqData.freq01;
			this._freq02 = freqData.freq02;
		}
	}

	getNextDates(amount: number = 1, refresh:boolean = true): Array<string> {
		console.log('attempting to fetch', amount, 'monthly records');
		if(refresh) super.resetGeneratedDates();
		let latestDate = this.getLatestDate();
		switch (this._type) {
			case MonthlyFrequencyType.INTERVAL:
				console.log('frequency type is interval, fetching dates for the', this._freq01, 'of the month')
				for (let i = 0; i < amount; i++) {
					const newLatestDate = getNextInvDate(latestDate, this._freq01, this._interval);
					console.log('new latest date:', newLatestDate);
					this._dates.push(newLatestDate);
					this._dateDetails.push({date: newLatestDate, userEntered: false});
					latestDate = newLatestDate;
				}
				break;
			case MonthlyFrequencyType.DAY_IN_MONTH:
				console.log('frequency type is day in month, attempting to fetch records for the', this._freq01, 'day in each month');
				for (let i = 0; i < amount; i++) {
					const newLatestDate = getNextDimDate(latestDate, +this._freq01, this._interval);
					this._dates.push(newLatestDate);
					this._dateDetails.push({date: newLatestDate, userEntered: false});
					latestDate = newLatestDate;
				}
				break;
			case MonthlyFrequencyType.WEEKDAY_IN_MONTH:
				console.log('frequency type is week day in month, attempting to fetch records for the', this._freq01, this._freq02, 'of every month');
				for (let i = 0; i < amount; i++) {
					const newLatestDate = getNextWdimDate(latestDate, this._freq02, this._freq01, this._interval);
					this._dates.push(newLatestDate);
					this._dateDetails.push({date: newLatestDate, userEntered: false});
					latestDate = newLatestDate;
				}
		}
		console.log(this._dates);
		return this._dates;
	}
	formatForSaving() {
		console.log('format for saving called in the mothly date object');
		const data =  Object.assign(super.formatForSaving(), {
			freqType: this._type,
			freq01: this._freq01,
			freq02: this._freq02
		});
		if(this._type !== MonthlyFrequencyType.WEEKDAY_IN_MONTH){
			delete data.freq02;
		}
		return data;
	}
	formatForDelivery(amount: number = 0, verbose:boolean = false, months: boolean = false){
		console.log('format for delivery called in a monthly date instance');
		const data = super.formatForDelivery(amount, verbose, months);
		return verbose ? Object.assign(data, {
			monthlyFrequencyType: this._type,
			freq01: this._freq01,
			freq02: this._freq02
		}): data;
	}
}
const setDefaultFrequencyValues = (type: MonthlyFrequencyType) => {
	switch (type) {
		case MonthlyFrequencyType.INTERVAL:
			return {freq01: 'start'};
		case MonthlyFrequencyType.DAY_IN_MONTH:
			return {freq01: '1'};
		case MonthlyFrequencyType.WEEKDAY_IN_MONTH:
			return {freq01: 'first', freq02: 'monday'}
	}
};
const getNextInvDate = (date: string, inv: string = 'start', interval = 1): string => {
	const newDate = addMonths(date, interval);
	switch (inv) {
		case 'start':
			return format(startOfMonth(newDate), 'YYYY-MM-DD');
		case 'end':
			return format(endOfMonth(newDate), 'YYYY-MM-DD');
		case 'middle':
			return format(setDate(newDate, Math.floor(getDaysInMonth(newDate) / 2)), 'YYYY-MM-DD');
		default:
			return format(startOfMonth(newDate), 'YYYY-MM-DD');
	}
};
const getNextDimDate = (date: string, monthDate: number, interval): string => format(addMonths(date, interval).setDate(monthDate), 'YYYY-MM-DD');

const getNextWdimDate = (date: string, weekDay: string, monthPlace: string, interval: number = 1): string => {
	let weekPlace = 0;
	console.log('attempting to create wdim date record for every ', monthPlace, weekDay, 'of the month');
	console.log('weekday number', weekDayMappings[weekDay.toLowerCase()]);
	const nextDate = setDay(startOfMonth(addMonths(date, interval)), weekDayMappings[weekDay.toLowerCase()]);
	console.log('nextDate', nextDate);
	switch (monthPlace) {
		case 'first':
			weekPlace = 1;
			break;
		case 'second':
			weekPlace = 2;
			break;
		case 'third':
			weekPlace = 3;
			break;
		default:
			weekPlace = 4;
	}
	return format(addWeeks(nextDate, weekPlace), 'YYYY-MM-DD');
};
