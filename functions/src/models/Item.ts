import DateManagement from "./DateManagement";
import MonthlyDateManagement, {MonthlyFrequencyType} from "./MonthlyDateManagement";
import RecurringDateManagement, {Frequency} from "./RecurringDateManagement";

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

	constructor(
		title: string,
		amount: number,
		direction: 1|-1 = -1,
		dates: dateLayout,
		tags: Array<string> = [],
		id?: string)
	{
			this._id = id;
			this._title = title;
			this._amount = amount;
			this._tags = tags;
			this._dates = createDateManagement(dates);
			this._direction = direction
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

	formatForDelivery(amount: number = 0, verbose: boolean = false){
		return {
			title: this.title,
			amount: this.amount,
			tags: this.tags,
			dates: this.dates.formatForDelivery(amount, verbose),
			isIncome: this._direction > 0,
			totalForDates: this.getAmountForDates()
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
