import {expect} from 'chai';
import 'mocha';
import Result from "../dto/Result";
import * as itemService from './ItemService';
import Item from '../models/Item';

describe('ItemService', () => {
	describe('mapItem', ()=>{
		const itemDetails = {
			title: 'wages',
			amount: 1000,
			isIncome: true,
			dates: {
				dates: ['2018-04-01'],
				frequency: 'MONTHLY',
				interval: 1,
				freq01: 'start',
				type: 'inv'
			},
			tags: ['wages', 'income'],
			id: 'iamanid'
		};
		it('should return an item from the details', () => {
			const item = itemService.mapItem(itemDetails);
			//console.log(item.formatForDelivery(4, true));
			expect(item).to.be.instanceOf(Item);
		})
	});
});
