import Item from "./Item";

export default class ItemList {
	private _items: Array<Item>;

	constructor(items: Array<Item>) {
		this._items = items;
	}


	get items(): Array<Item> {
		return this._items;
	}

	generateSummary(list:boolean = false, summary: boolean = false){
		console.log('item list attempting to generate summary details');
		let summaryList = this._items.map(item => item.generateSummary());
		if(list && ! summary) return summaryList;
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
		const totalDayIncomeCount = summaryList
			.filter(item => item.finance.direction > 0)
			.map(item => item.finance.todayCount)
			.reduce((acc, current) => acc + current, 0);
		const totalDayExpenseCount = summaryList
			.filter(item => item.finance.direction < 0)
			.map(item => item.finance.todayCount)
			.reduce((acc, current) => acc + current, 0);
		const totalDayTransactionCount = summaryList
			.map(item => item.finance.todayCount)
			.reduce((acc, current) => acc + current, 0);
		const totalWeekIncomeCount = summaryList
			.filter(item => item.finance.direction > 0)
			.map(item => item.finance.thisWeekCount)
			.reduce((acc, current) => acc + current, 0);
		const totalWeekExpenseCount = summaryList
			.filter(item => item.finance.direction < 0)
			.map(item => item.finance.thisWeekCount)
			.reduce((acc, current) => acc + current, 0);
		const totalWeekTransactionCount = summaryList
			.map(item => item.finance.thisWeekCount)
			.reduce((acc, current) => acc + current, 0);
		const totalMonthIncomeCount = summaryList
			.filter(item => item.finance.direction > 0)
			.map(item => item.finance.thisMonthCount)
			.reduce((acc, current) => acc + current, 0);
		const totalMonthExpenseCount = summaryList
			.filter(item => item.finance.direction < 0)
			.map(item => item.finance.thisMonthCount)
			.reduce((acc, current) => acc + current, 0);
		const totalMonthTransactionCount = summaryList
			.map(item => item.finance.thisMonthCount)
			.reduce((acc, current) => acc + current, 0);
		const totalWeeklyIncome = summaryList
			.filter(item => item.finance.direction > 0)
			.map(item => item.finance.thisWeekAmount)
			.reduce((acc, current) => acc + current, 0);
		const totalWeeklyExpense = summaryList
			.filter(item => item.finance.direction < 0)
			.map(item => item.finance.thisWeekAmount)
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
		summaryList = summaryList.filter(item => item.dates.today.length + item.dates.thisWeek.length + item.dates.thisMonth.length > 0);
		const data = {
			itemSummary: summaryList,
			finance: {
				daily: {
					income: totalDayIncome,
					expense: totalDayExpense,
					balance: totalDayBalance,
					incomeCount: totalDayIncomeCount,
					expenseCount: totalDayExpenseCount
				},
				weekly: {
					inc: {
						income: totalDayIncome + totalWeeklyIncome,
						expense: totalDayExpense + totalWeeklyExpense,
						balance: totalDayBalance +totalWeeklyBalance,
						incomeCount: totalDayIncomeCount + totalWeekIncomeCount,
						expenseCount: totalDayExpenseCount + totalWeekExpenseCount
					},
					exc: {
						income: totalWeeklyIncome,
						expense: totalWeeklyExpense,
						balance: totalWeeklyBalance,
						incomeCount: totalWeekIncomeCount,
						expenseCount: totalWeekExpenseCount
					}
				},
				monthly: {
					inc: {
						income: totalDayIncome + totalWeeklyIncome + totalMonthlyIncome,
						expense: totalDayExpense + totalWeeklyExpense + totalMonthlyExpense,
						balance: totalDayBalance + totalWeeklyBalance + totalMonthlyBalance,
						incomeCount: totalDayIncomeCount + totalWeekIncomeCount + totalMonthIncomeCount,
						expenseCount: totalDayExpenseCount + totalWeekExpenseCount + totalMonthExpenseCount
					},
					exc: {
						income: totalMonthlyIncome,
						expense: totalMonthlyExpense,
						balance: totalMonthlyBalance,
						incomeCount: totalMonthIncomeCount,
						expenseCount: totalMonthExpenseCount
					}
				}
			}
		};
		if(!list) return data.finance;
		return data;
	}
}
