import DateManagement from "./DateManagement";
import MonthlyDateManagement, {MonthlyFrequencyType} from "./MonthlyDateManagement";
import RecurringDateManagement, {Frequency} from "./RecurringDateManagement";
import * as isToday from 'date-fns/is_today';
import * as isAfter from 'date-fns/is_after';
import * as isBefore from 'date-fns/is_before';
import PastRecords from "./PastRecords";
import PastRecord from "./PastRecord";

type dateLayout = {
	isRecurring: boolean;
	dates: Array<string>;
	frequency?: string;
	interval?:number;
	freq01?:string;
	freq02?:string;
	type?: string;
}
export default class Item {
	private _id: string;
	private _direction: 1|-1;
	private _title: string;
	private _amount: number;
	readonly _tags: Array<string>;
	readonly _dates: DateManagement;
	private _pastRecords: PastRecords;


	constructor(
		title: string,
		amount: number,
		direction: 1|-1 = -1,
		dates: dateLayout,
		tags: Array<string> = [],
		pastRecords?: PastRecords,
		id?: string)
	{
			this._id = id;
			this._title = title;
			this._amount = amount;
			this._tags = tags;
			this._dates = createDateManagement(dates);
			this._direction = direction;
			if(pastRecords) this._pastRecords = pastRecords;
			else {
				console.log('past records does not exist, generating from dates');
				const mappedPastRecords: Array<PastRecord> = [];
				this.dates.dates.forEach(date => {
					console.log('attempting to convert date', date, 'to past record');
					mappedPastRecords.push(new PastRecord(date, this._amount))
				});
				this._pastRecords = new PastRecords(mappedPastRecords);
			}
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


	get tags(): Array<string> {
		return this._tags;
	}

	get dates(): DateManagement {
		return this._dates;
	}


	get direction(): 1 | -1 {
		return this._direction;
	}
	set pastRecords(records: PastRecords) {
		this._pastRecords = records;
	}
	get pastRecords():PastRecords{
		return this._pastRecords;
	}
	getAmountForDates() {
		return this._amount * this._dates.dates.length;
	}

	getAmountForUserEnteredDates() {
		return this._amount * this._dates.getUserEnteredDates().length;
	}
	formatForSaving() {
		return {
			title: this.title,
			amount: this.amount,
			tags: this.tags,
			dates: this.dates.formatForSaving(),
			isIncome: this._direction > 0
		}
	}

	/*getOverdue () {
		console.log('fetching overdue dates for record with title', this._title);
		const today = new Date();
		if(isToday(this._lastCompletedDate) || isAfter(this._lastCompletedDate, today)) return [];
		console.log('last completed before today');
		const overdueDates =  this._dates.dates.filter(date => isAfter(this._lastCompletedDate, date) && isBefore(today, date))
		console.log('number of overdue dates found:', overdueDates.length);
		return overdueDates;
	}*/

	formatForDelivery(amount: number = 0, verbose: boolean = false, months: boolean = false){
		console.log('formatting for delivery in Item model, fetching months?', true);
		const base = {
			title: this.title,
			amount: this.amount,
			tags: this.tags,
			dates: this.dates.formatForDelivery(amount, verbose, months),
			isIncome: this._direction > 0,
			totalForDates: this.getAmountForDates(),
			pastRecords: this._pastRecords.formatForDelivery(),
			id: this._id
		};
		return verbose ? Object.assign(base, {
			totalForDates: this.getAmountForDates()
		}): base;
	}
	generateFianancialSummary () {
		const summary = this._dates.getMonthSummary();
		const todayCost = this._amount * summary.today.length;
		const thisWeekCost = this._amount * summary.thisWeek.length;
		const thisMonthCost = this._amount * summary.thisMonth.length;
		return {
			todayAmount: todayCost,
			thisWeekAmount: thisWeekCost,
			thisMonthAmount: thisMonthCost,
			absoluteTotal: thisMonthCost + todayCost + thisWeekCost,
			realTotal: (thisMonthCost + todayCost + thisWeekCost) * this._direction,
			direction: this._direction
		}
	}
	generateSummary(){
		return {
			title: this._title,
			amount: this._amount,
			dates: this._dates.getMonthSummary(),
			finance: this.generateFianancialSummary(),
			records: this._pastRecords.formatForDelivery()
		}
	}
	getFinancialSummary(){
		console.log('fetching financial summary');
		return {
			type: this._direction > 0 ? 'income': 'expense',
			absoluteMonth: this._dates.getNumberOfTransactionsPerMonth() * this._amount,
			month: (this._dates.getNumberOfTransactionsPerMonth() * this._amount)*this._direction,
			absoluteThreeMonth: (this._dates.getNumberOfTransactionsPerMonth() * 3) * this._amount,
			threeMonth:  ((this._dates.getNumberOfTransactionsPerMonth() * 3) * this._amount) * this._direction,
			absoluteSixMonth: (this._dates.getNumberOfTransactionsPerMonth() * 6) * this._amount,
		}
	}
}

const createDateManagement = (dateDetails: dateLayout): DateManagement => {
	if(!dateDetails.isRecurring) return new DateManagement(false, dateDetails.dates || []);
	if(dateDetails.frequency.toLowerCase() === 'monthly') return new MonthlyDateManagement(dateDetails.dates, dateDetails.freq01, dateDetails.freq02, getMonthlyType(dateDetails.type), dateDetails.interval);
	return new RecurringDateManagement(dateDetails.dates, getRecurringType(dateDetails.frequency), dateDetails.interval)
};

const getMonthlyType = (type:string) => {
	switch(type){
		case 'dim':
			return MonthlyFrequencyType.DAY_IN_MONTH;
		case 'inv':
			return MonthlyFrequencyType.INTERVAL;
		default:
			return MonthlyFrequencyType.WEEKDAY_IN_MONTH;
	}
};

const getRecurringType = (type: string) => {
	switch(type.toLowerCase()){
		case 'weekly':
			return Frequency.weekly;
		case 'monthly':
			return Frequency.monthly;
		default:
			return Frequency.daily;
	}
};
