const Employee = require('../employee.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {
	it('should not throw an error if all the arguments are ok', () => {
		const cases = [
			{ firstName: 'John', lastName: 'Doe', department: 'HR' },
			{ firstName: 'Jerry', lastName: 'Smith', department: 'IT' },
			{ firstName: 'Jerry', lastName: 'Adams', department: 'ADMINISTRATION' }
		];

		for (let item of cases) {
			const emp = new Employee(item);

			emp.validate((err) => {
				expect(err).to.not.exist;
			});
		}
	});

	it('should throw an error if any of the arguments are missing', () => {
		const cases = [
			{ firstName: 'John', lastName: 'Doe' },
			{ firstName: 'John', department: 'HR' },
			{ lastName: 'Doe', department: 'HR' },
		];

		for (let item of cases) {
			const emp = new Employee(item);

			emp.validate((err) => {
				expect(err.errors.firstName || err.errors.lastName || err.errors.department).to.exist;
			});
		}
	});

	it('should throw an error if any of the arguments is not a string', () => {
		const cases = [
			{ firstName: [], lastName: 'Doe', department: 'HR' },
			{ firstName: {}, lastName: 'Doe', department: 'HR' },
			{ firstName: 'John', lastName: [], department: 'HR' },
			{ firstName: 'John', lastName: {}, department: 'HR' },
			{ firstName: 'John', lastName: 'Doe', department: [] },
			{ firstName: 'John', lastName: 'Doe', department: {} },
		];

		for (let item of cases) {
			const emp = new Employee(item);

			emp.validate((err) => {
				expect(err.errors.firstName || err.errors.lastName || err.errors.department).to.exist;
			});
		}
	});
});

after(() => {
	mongoose.models = {};
});