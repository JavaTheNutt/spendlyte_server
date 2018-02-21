import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import 'mocha';

import { getSkipFromMonthNum, getFetchPeriod, fallsInFetchPeriod } from "./DateUtils";
import moment = require("moment");

chai.use(sinonChai);
const expect = chai.expect;
const sandbox = sinon.sandbox.create();

describe('DateUtils.ts', () => {
	afterEach(() => sandbox.restore());
	describe('getSkipFromMonthNum', ()=>{
		it('should return the number of months between the current month and the selected month', () => {
			const futureMonth = moment().add(3, 'months');
			expect(getSkipFromMonthNum(+futureMonth.format('M'))).to.equal(3);
			futureMonth.subtract(4, 'months');
			expect(getSkipFromMonthNum(+futureMonth.format('M'))).to.equal(11);
		});
		it('should return 0 when the current month is passed', () => {
			expect(getSkipFromMonthNum(+moment().format('M'))).to.eql(0);
		});
	});
	describe('getFetchPeriod', () => {
		it('should return today as the start, and one month from today as the end by default', () => {
			const result = getFetchPeriod();
			expect(result.start, 'start does not match').to.equal(moment().format('YYYY-MM-DD'));
			expect(result.end, 'end does not match').to.equal(moment().add(1, 'months').format('YYYY-MM-DD'));
		});
		it('should return today as the start and two months from today when num is set to two', () => {
			const result = getFetchPeriod(2);
			expect(result.start, 'start does not match').to.equal(moment().format('YYYY-MM-DD'));
			expect(result.end, 'end does not match').to.equal(moment().add(2, 'months').format('YYYY-MM-DD'));
		});
		it('should return one month from today as the start and three months from today as the end when num is set to two and skip is set to one', () => {
			const result = getFetchPeriod(2, 1);
			expect(result.start, 'start does not match').to.equal(moment().add(1, 'months').format('YYYY-MM-DD'));
			expect(result.end, 'end does not match').to.equal(moment().add(3, 'months').format('YYYY-MM-DD'));
		});
	});
	describe('fallsInFetchPeriod', () => {
		it('should return true for dates that fall in the fetch period', () => {
			let startDate = moment().subtract(1, 'day').format('YYYY-MM-DD');
			let endDate = moment().add(1, 'day').format('YYYY-MM-DD');
			expect(fallsInFetchPeriod({start: startDate, end: endDate}, moment().format('YYYY-MM-DD'))).to.be.true;
		});
		it('should return false for dates that fall outside of the fetch period', () => {
			let endDate = moment().subtract(1, 'day').format('YYYY-MM-DD');
			let startDate = moment().add(1, 'day').format('YYYY-MM-DD');
			expect(fallsInFetchPeriod({start: startDate, end: endDate}, moment().format('YYYY-MM-DD'))).to.be.false;
		});
	})
});
