const Employee = require('../employee.model');
const Department = require('../department.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {
	before(async () => {
		try {
			await mongoose.connect('mongodb://localhost:27017/companyDBtest', {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			});
		} catch (err) {
			console.error(err);
		}
	});

	describe('Reading data', () => {
		before(async () => {
			const testEmpOne = new Employee({firstName: 'John', lastName: 'Doe', department: 'HR' });
			await testEmpOne.save();

			const testEmpTwo = new Employee({firstName: 'Jerry', lastName: 'Smith', department: 'IT' });
			await testEmpTwo.save();
		});

		it('should return all the data with "find" method', async () => {
			const employees = await Employee.find();
			const expectedLength = 2;
			expect(employees.length).to.be.equal(expectedLength);
		});
		it('should return proper document by various params with findOne method', async () => {
			const employee = await Employee.findOne({ firstName: 'John', lastName: 'Doe', department: 'HR'});
			const expectedParams = { firstName: 'John', lastName: 'Doe', department: 'HR' };
			for (let key in expectedParams) {
				expect(employee[key]).to.be.equal(expectedParams[key]);
			}
		});

		after(async () => {
			await Employee.deleteMany();
		});
	});

	describe('Creating data', () => {
		it('should insert new document with "insertOne" method', async () => {
			const employee = new Employee({firstName: 'John', lastName: 'Doe', department: 'HR'});
			await employee.save();
			expect(employee.isNew).to.be.false;
		});

		after(async () => {
			await Employee.deleteMany();
		});
	});

	describe('Updating data', () => {
		beforeEach(async () => {
			const testEmpOne = new Employee({ firstName: 'John', lastName: 'Doe', department: 'HR' });
			await testEmpOne.save();

			const testEmpTwo = new Employee({ firstName: 'Jerry', lastName: 'Smith', department: 'IT' });
			await testEmpTwo.save();
		});

		it('should properly update one document with "updateOne" method', async () => {
			await Employee.updateOne(
				{firstName: 'John', lastName: 'Doe', department: 'HR'},
				{ $set: { firstName: 'Katy' } }
			);
			const updatedEmployee = await Employee.findOne({firstName: 'Katy', lastName: 'Doe', department: 'HR'});
			expect(updatedEmployee).to.not.be.null;
		});

		it('should properly update one document with "save" method', async () => {
			const employee = await Employee.findOne({firstName: 'Jerry', lastName: 'Smith', department: 'IT'});
			employee.firstName = 'Miranda';
			await employee.save();

			const updatedEmployee = await Employee.findOne({ firstName: 'Miranda', lastName: 'Smith', department: 'IT' });
			expect(updatedEmployee).to.not.be.null;
		});

		it('should properly update multiple documents with "updateMany" method', async () => {
			await Employee.updateMany({}, { $set: { lastName: 'Onar' } });
			const employees = await Employee.find();
			expect(employees[0].lastName).to.be.equal('Onar');
			expect(employees[1].lastName).to.be.equal('Onar');
		});

		afterEach(async () => {
			await Employee.deleteMany();
		});
	});

	describe('Removing data', () => {
		beforeEach(async () => {
			const testEmpOne = new Employee({ firstName: 'John', lastName: 'Doe', department: 'HR' });
			await testEmpOne.save();

			const testEmpTwo = new Employee({ firstName: 'Jerry', lastName: 'Smith', department: 'IT' });
			await testEmpTwo.save();
		});

		it('should properly remove one document with "deleteOne" method', async () => {
			await Employee.deleteOne({firstName: 'John', lastName: 'Doe', department: 'HR'});
			const deletedEmployee = await Employee.findOne({firstName: 'John', lastName: 'Doe', department: 'HR'});
			expect(deletedEmployee).to.be.null;
		});

		it('should properly remove one document with "remove" method', async () => {
			const employee = await Employee.findOne({firstName: 'John', lastName: 'Doe', department: 'HR'});
			await employee.remove();
			const removedEmployee = await Employee.findOne({firstName: 'John', lastName: 'Doe', department: 'HR'});
			expect(removedEmployee).to.be.null;
		});

		it('should properly remove multiple documents with "deleteMany" method', async () => {
			await Employee.deleteMany();
			const employee = await Employee.find();
			expect(employee.length).to.be.equal(0);
		});

		afterEach(async () => {
			await Employee.deleteMany();
		});
	});
});