import * as compareDesc from "date-fns/compare_desc";
import * as format from 'date-fns/format';
import * as isInRange from 'date-fns/is_within_range';
import * as addDays from 'date-fns/add_days';
import * as subDays from 'date-fns/sub_days';
import * as isToday from "date-fns/is_today";
import * as isAfter from 'date-fns/is_after';
import * as isBefore from 'date-fns/is_before';

export type DateDetails = {
	date:string,
	userEntered: boolean
}
export default class DateManagement {
	protected _isRecurring: boolean;
	protected _dates: Array<string>;
	protected _dateDetails : Array<DateDetails>;
	protected _occursToday: boolean;
	protected _occursTodayTested: boolean;
	protected _occursThisWeek: boolean;
	protected _occursThisWeekTested: boolean;
	protected _occursThisMonth: boolean;
	protected _occursThisMonthTested: boolean;
	protected _monthlyOccurrenceCount: number;
	protected _monthlyOccurrenceCountTested: boolean;
	protected _weeklyOccurrenceCount: number;
	protected _weeklyOccurrenceCountTested: boolean;
	protected _weeklyOccurrenceDates: Array<string>;
	protected _weeklyOccurrenceDatesTested: boolean;
	protected _monthlyOccurrenceDatesTested: boolean;
	protected _monthlyOccurrenceDates: Array<string>;

	constructor(isRecurring: boolean = false, dates: Array<string> = []) {
		this._isRecurring = isRecurring;
		this._dates = dates;
		this._dateDetails = createUserEnteredDateDetails(this._dates);
		this._occursToday = false;
		this._occursTodayTested = false;
		this._occursThisWeek = false;
		this._occursThisWeekTested = false;
		this._monthlyOccurrenceCount = 0;
		this._monthlyOccurrenceCountTested = false;
		this._weeklyOccurrenceCount = 0;
		this._monthlyOccurrenceCountTested = false;
		this._weeklyOccurrenceDates = [];
		this._weeklyOccurrenceDatesTested = false;
		this._monthlyOccurrenceDates = [];
		this._monthlyOccurrenceDatesTested = false;
	}

	get isRecurring(): boolean {
		return this._isRecurring;
	}

	set isRecurring(value: boolean) {
		this._isRecurring = value;
	}

	get dates(): Array<string> {
		return this._dates;
	}

	set dates(value: Array<string>) {
		this._dates = value;
	}

	get occursToday(): boolean {
		if (this._occursTodayTested) return this._occursToday;
		this._occursToday = anyOccursToday(this.dates);
		this._occursTodayTested = true;
		return this._occursToday;
	}

	get occursThisWeek(): boolean {
		if (this._occursThisWeekTested) return this._occursThisWeek;
		this._occursThisWeek = anyOccursThisWeek(this.dates);
		this._occursThisWeekTested = true;
		return this._occursThisWeek;
	}

	get occursThisMonth(): boolean {
		if (this._occursThisMonthTested) return this._occursThisMonth;
		this._occursThisMonth = anyOccursThisMonth(this.dates);
		this._occursThisMonthTested = true;
		return this._occursThisMonth;
	}

	get monthlyOccurrenceCount(): number {
		if (!this.occursThisMonth) return 0;
		if (this._monthlyOccurrenceCountTested) return this._monthlyOccurrenceCount;
		this._monthlyOccurrenceCount = countMonthlyOccurrence(this._dates);
		this._monthlyOccurrenceCountTested = true;
		return this._monthlyOccurrenceCount;
	}

	get weeklyOccurrenceCount(): number {
		if (!this.occursThisWeek) return 0;
		if (this._weeklyOccurrenceCountTested) return this._weeklyOccurrenceCount;
		this._weeklyOccurrenceCount = countWeeklyOccurrence(this._dates);
		return this._weeklyOccurrenceCount;
	}

	get weeklyOccurrenceDates(): Array<string> {
		if (this._weeklyOccurrenceDatesTested) return this._weeklyOccurrenceDates;
		this._weeklyOccurrenceDates = weeklyOccurrenceDates(this._dates);
		if (this._weeklyOccurrenceDates.length > 0) {
			this._weeklyOccurrenceCount = this._weeklyOccurrenceDates.length;
			this._weeklyOccurrenceCountTested = true;
			this._occursThisMonth = true;
			this._occursThisMonthTested = true;
		}
		this._weeklyOccurrenceDatesTested = true;
		return this._weeklyOccurrenceDates;
	}

	get monthlyOccurrenceDates(): Array<string> {
		if (this._monthlyOccurrenceDatesTested) return this._monthlyOccurrenceDates;
		this._monthlyOccurrenceDates = monthlyOccurrenceDates(this._dates);
		if (this._monthlyOccurrenceDates.length > 0) {
			this._monthlyOccurrenceCount = this._monthlyOccurrenceDates.length;
			this._monthlyOccurrenceCountTested = true;
			this._occursThisMonth = true;
			this._occursThisMonthTested = true;
		}
		this._monthlyOccurrenceDatesTested = true;
		return this._monthlyOccurrenceDates;
	}

	addDate(value: string, userEntered: boolean = true) {
		this._dates.push(value);
	}

	getLatestDate(): string {
		return format(this.dates.sort(compareDesc)[0], 'YYYY-MM-DD')
	}

	getWeeklyDates(): Array<string> {
		return weeklyOccurrenceDates(this._dates);
	}

	getMonthlyDates(): Array<string> {
		return monthlyOccurrenceDates(this._dates);
	}

	getUserEnteredDates (): Array<string> {
		return this._dateDetails.filter(date => date.userEntered).map(dateObj => dateObj.date);
	}

	formatForSaving() {
		console.log('format for saving called in the base date object');
		return {
			dates: this.getUserEnteredDates()
		}
	}
	formatForDelivery (amount: number = 0, verbose: boolean = false) {
		const base = {
			dates: this._dates
		};
		return verbose ? Object.assign(base, {
			userEntered: this.getUserEnteredDates(),
			future: this.getFuture(),
			past: this.getPast(),
			today: this.occursToday,
			thisWeek: this.weeklyOccurrenceDates,
			thisMonth: this.monthlyOccurrenceDates
		}): base;
	}
	getFuture () {
		return this._dates.filter(date => (isToday(date) || isAfter(date, new Date())))
	}
	getPast () {
		return this._dates.filter(date => (isToday(date) || isBefore(date, new Date())));
	}

}
const anyOccursToday = (dates: Array<string>): boolean => dates.indexOf(format(new Date(), 'YYYY-MM-DD')) !== -1;

const anyOccursThisWeek = (dates: Array<string>): boolean => dates.some(date => occursThisWeek(date));

const anyOccursThisMonth = (dates: Array<string>): boolean => dates.some(date => occursThisMonth(date));

const occursToday = (date: string): boolean => isToday(date);

const occursThisWeek = (date: string): boolean => isInRange(date, subDays(new Date(), 1), addDays(new Date(), 7));

const occursThisMonth = (date: string): boolean => isInRange(date, subDays(new Date(), 1), addDays(new Date(), 30));

const monthlyOccurrenceDates = (dates: Array<string>): Array<string> => dates.filter(date => occursThisMonth(date));

const weeklyOccurrenceDates = (dates: Array<string>): Array<string> => dates.filter(date => occursThisWeek(date));

const countMonthlyOccurrence = (dates: Array<string>): number => monthlyOccurrenceDates(dates).length;

const countWeeklyOccurrence = (dates: Array<string>): number => weeklyOccurrenceDates(dates).length;

const createUserEnteredDateDetails = (dates: Array<string>): Array<DateDetails> => dates.map(date => ({date, userEntered: true}))

