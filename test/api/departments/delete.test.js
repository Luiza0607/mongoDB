const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server.js');
const Department = require('../../../models/department.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('DELETE /api/departments', () => {
	beforeEach(async () => {
		const testDepOne = new Department({ _id: '5d9f1140f10a81216cfd4408', name: 'Department #1' });
		await testDepOne.save();

	});

	afterEach(async () => {
		await Department.deleteMany();
	});

	it('/:id should delete chosen document and return success', async () => {
		const res = await request(server).delete('/api/departments/5d9f1140f10a81216cfd4408');

		const deletedDepartment = await Department.findOne({_id: '5d9f1140f10a81216cfd4408'});

		expect(res.status).to.be.equal(200);
		expect(res.body.message).to.be.equal('OK');
		expect(deletedDepartment).to.be.null;
	});

	it('/wrong :id should return status 404 and message "Not found..."', async () => {
		const res = await request(server).delete('/api/departments/6d9f1140f10a81216cfd4409');
		expect(res.status).to.be.equal(404);
		expect(res.body.message).to.be.equal('Not found...');
	});
});