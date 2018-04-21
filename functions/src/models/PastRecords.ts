import PastRecord from "./PastRecord";
import * as isToday from 'date-fns/is_today';
import * as isBefore from 'date-fns/is_before';

export default class PastRecords {
	private _records: Array<PastRecord>;

	constructor(records: Array<PastRecord>) {
		this._records = records;
	}

	get records(): Array<PastRecord> {
		return this._records;
	}

	set records(value: Array<PastRecord>) {
		this._records = value;
	}
	getCompleted(): Array<PastRecord>{
		return this._records.filter(record => record.completed)
	}
	getUncompleted(): Array<PastRecord>{
		return this._records.filter(record => !record.completed)
	}
	getOverdue():Array<PastRecord>{
		return this.getUncompleted().filter(date => isToday(date.date) || isBefore(date.date, new Date()))
	}
	getHasActual(): Array<PastRecord>{
		return this._records.filter(record => record.actual);
	}
	getSummary(list: boolean = false){
		const data:any = {};
		if(list){
			data.records = this._records.map(record => record.formatForDelivery());
			data.overdue = this.getOverdue().map(record => record.formatForDelivery());
		}
		data.total = this.getTotals();
		data.overdueTotal = this.getOverdueTotals();
		return data;
	}
	getOverdueTotals(){
		const overdueActualTotal = this.getOverdue().map(record => record.actual).reduce((acc, num) => acc + num, 0);
		const overdueBudgetTotal = this.getOverdue().map(record => record.budgeted).reduce((acc, num) => acc + num, 0);
		return {
			actual: overdueActualTotal,
			budget: overdueBudgetTotal
		}
	}
	getTotals(){
		const actualTotal = this._records.map(record => record.actual).reduce((acc, num) => acc + num, 0);
		const budgetTotal = this._records.map(record => record.budgeted).reduce((acc, num) => acc + num, 0);
		return {
			actual: actualTotal,
			budget: budgetTotal
		}
	}
	formatForSaving(){
		return this._records.map(record => record.formatForSaving())
	}
	formatForDelivery(){
		return this._records.map(record => record.formatForDelivery())
	}

}
const addActual = (list: Array<PastRecord>): number => {
	return list.filter(record => record.actual).map(record => record.actual).reduce((acc, item) => acc + item, 0)
};

const addBudgeted = (list: Array<PastRecord>): number => {
	return list.map(record => record.budgeted).reduce((acc, item) => acc + item, 0)
};
