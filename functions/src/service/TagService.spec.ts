import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as FirestoreUtil from "../util/Firestore";
import * as tagService from './TagService';
import 'mocha';
import Result from "../dto/Result";

chai.use(sinonChai);
const expect = chai.expect;
const sandbox = sinon.sandbox.create();

describe('TagService', () => {
	let fetchDocumentStub, publicResult, customResult, failedResult, err;
	afterEach(() => sandbox.restore());
	beforeEach(() => {
		err = new Error('i am an error');
		fetchDocumentStub = sandbox.stub(FirestoreUtil, 'fetchDocument');
		customResult = new Result(true, [{'test01': true, 'test02': true}]);
		publicResult = new Result(true, [{'test03': true, 'test04': true}]);
		failedResult = new Result(false, null, 500, err);
	});
	describe('fetchTags', () => {
		it('should return the tags as on object with two arrays', async () => {
			fetchDocumentStub.withArgs('tags/myname/').resolves(customResult);
			fetchDocumentStub.withArgs('tags/public/').resolves(publicResult);
			const res = await tagService.fetchTags('myname');
			expect(res.success).to.be.true;
			expect(res.data[0]).to.eql({
				custom: ['test01', 'test02'],
				public: ['test03', 'test04']
			})
		});
		it('should handle execptions fetching custom results', async () => {
			fetchDocumentStub.withArgs('tags/myname/').resolves(failedResult);
			fetchDocumentStub.withArgs('tags/public/').resolves(publicResult);
			const res = await tagService.fetchTags('myname');
			expect(res.success).to.be.false;
			expect(res.error).to.eql(err);
		});
		it('should handle execptions fetching public results', async () => {
			fetchDocumentStub.withArgs('tags/myname/').resolves(customResult);
			fetchDocumentStub.withArgs('tags/public/').resolves(failedResult);
			const res = await tagService.fetchTags('myname');
			expect(res.success).to.be.false;
			expect(res.error).to.eql(err);
		});
	})
});
