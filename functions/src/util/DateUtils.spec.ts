import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import 'mocha';

import { getSkipFromMonthNum } from "./DateUtils";
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
		})
	})
});
