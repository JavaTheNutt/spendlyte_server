import Item from "./Item";

export default class ItemList {
	private _items: Array<Item>;

	constructor(items: Array<Item>) {
		this._items = items;
	}


	get items(): Array<Item> {
		return this._items;
	}

	generateSummary(list:boolean = false){
		console.log('item list attempting to generate summary details');
		const summaryList = this._items.map(item => item.generateSummary());
		console.log(summaryList.length, 'summaries generated');
		const totalDayIncome = summaryList
			.filter(item => item.finance.realTotal > 0)
			.map(item => item.finance.todayAmount)
			.reduce((acc, current) => acc + current, 0);
		const totalDayExpense = summaryList
			.filter(item => item.finance.realTotal < 0)
			.map(item => item.finance.todayAmount)
			.reduce((acc, current) => acc + current, 0);
		const totalDayBalance = summaryList
			.map(item => item.finance.todayAmount * item.finance.direction)
			.reduce((acc, current) => acc + current, 0);
		const totalWeeklyIncome = summaryList
			.filter(item => item.finance.direction > 0)
			.map(item => item.finance.thisWeekAmount)
			.reduce((acc, current) => acc + current, 0);
		const totalWeeklyExpense = summaryList
			.filter(item => item.finance.direction < 0)
			.map(item => item.finance.todayAmount)
			.reduce((acc, current) => acc + current, 0);
		const totalWeeklyBalance = summaryList
			.map(item => item.finance.thisWeekAmount * item.finance.direction)
			.reduce((acc, current) => acc + current, 0);
		const totalMonthlyIncome = summaryList
			.filter(item => item.finance.direction > 0)
			.map(item => item.finance.thisMonthAmount)
			.reduce((acc, current) => acc + current, 0);
		const totalMonthlyExpense = summaryList
			.filter(item => item.finance.direction < 0)
			.map(item => item.finance.thisMonthAmount)
			.reduce((acc, current) => acc + current, 0);
		const totalMonthlyBalance = summaryList
			.map(item => item.finance.thisMonthAmount * item.finance.direction)
			.reduce((acc, current) => acc + current, 0);

		const data = {
			itemSummary: summaryList,
			finance: {
				daily: {
					income: totalDayIncome,
					expense: totalDayExpense,
					balance: totalDayBalance
				},
				weekly: {
					inc: {
						income: totalDayIncome + totalWeeklyIncome,
						expense: totalDayExpense + totalWeeklyExpense,
						balance: totalDayBalance +totalWeeklyBalance
					},
					exc: {
						income: totalWeeklyIncome,
						expense: totalWeeklyExpense,
						balance: totalWeeklyBalance
					}
				},
				monthly: {
					inc: {
						income: totalDayIncome + totalWeeklyIncome + totalMonthlyIncome,
						expense: totalDayExpense + totalWeeklyExpense + totalMonthlyExpense,
						balance: totalDayBalance + totalWeeklyBalance + totalMonthlyBalance
					},
					exc: {
						income: totalMonthlyIncome,
						expense: totalMonthlyExpense,
						balance: totalMonthlyBalance
					}
				}
			}
		};
		if(!list) return data.finance;
		return data;
	}
}
