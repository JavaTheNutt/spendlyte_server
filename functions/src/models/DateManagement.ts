import * as compareDesc from "date-fns/compare_desc";
import * as format from 'date-fns/format';
import * as isInRange from 'date-fns/is_within_range';
import * as addDays from 'date-fns/add_days';
import * as addMonths from 'date-fns/add_months';
import * as addWeeks from 'date-fns/add_weeks';
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
	protected _frequency: string;

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
		this._frequency = 'none';
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
	formatForDelivery (amount: number = 0, verbose: boolean = false, months: boolean = false) {
		console.log('formatting for delivery in base date management model');
		console.log('generating months?', months);
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
	getTodaysDates ():Array<string> {
		return this._dates.filter(date => isToday(date));
	}
	getMonthSummary (): {today:Array<string>, thisWeek:Array<string>, thisMonth:Array<string>}{
		let monthDates = this.getWithinMonths(1);
		const today = new Date();
		const todayDates = monthDates.filter(date => isToday(date));
		monthDates = monthDates.filter(date => !isToday(date));
		const weekDates = monthDates.filter(date => isAfter(date, addDays(today, 1)) && isBefore(date, addDays(today, 7)));
		monthDates = monthDates.filter(date => isAfter(date, addDays(today, 1)) && !isBefore(date, addDays(today, 7)));
		return {
			today: todayDates,
			thisWeek: weekDates,
			thisMonth: monthDates
		}
	}
	getBefore (lastDate:string, future: boolean = false): Array<string>{
		console.log('attempting to fetch dates before', lastDate);
		const baseDates = future ? this.getFuture() : this._dates;
		const filteredDates =  baseDates.filter(date => {
			console.log('attempting to check if', date, 'is before', lastDate);
			const res = isBefore(date, lastDate);
			console.log('is before?', res);
			return res;
		});
		console.log(filteredDates.length, 'dates found before', lastDate);
		return filteredDates;
	}
	getWithinMonths(amount:number): Array<string>{
		console.log('attempting to get dates within', amount, 'months');
		return this.getBefore(format(addMonths(new Date(), amount), 'YYYY-MM-DD'), true)
	}
	getWithinMonthsCount(amount:number){
		return this.getWithinMonths(amount).length;
	}
	getWithinWeeks(amount:number = 1): Array<string>{
		return this.getBefore(format(addWeeks(new Date(), amount), 'YYYY-MM-DD'), true);
	}
	getWithinThreeMonths(): Array<string>{
		return this.getWithinMonths(3)
	}
	getThreeMonthCount(): number {
		return this.getWithinThreeMonths().length;
	}
	getWithinSixMonths(): Array<string>{
		return this.getWithinMonths(6);
	}
	getSixMonthCount(): number {
		return this.getWithinSixMonths().length;
	}
	getFuture () {
		return this._dates.filter(date => (isToday(date) || isAfter(date, new Date())))
	}
	getPast () {
		return this._dates.filter(date => (isToday(date) || isBefore(date, new Date())));
	}

	resetGeneratedDates():void {
		this._dates = this.getUserEnteredDates();
	}

	getNextDatesForMonths(amount: number = 1, refresh: boolean = false): Array<string>{
		console.log('generating dates in base date management model, returning base dates');
		return this._dates
	}
	getNumberOfTransactionsPerMonth(){
		switch (this._frequency.toLowerCase()) {
			case 'weekly':
				return 4;
			case 'monthly':
				return 1;
			case 'daily':
				return 30;
			default:
				return 0;
		}
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

