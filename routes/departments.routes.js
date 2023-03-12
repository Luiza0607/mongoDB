const express = require('express');
const router = express.Router();
const DepartmentController = require('../controllers/departments.controller');

router.get('/departments', DepartmentController.getAll);
router.get('/departments/random', DepartmentController.getRandom);
router.get('/departments/:id', DepartmentController.getById);
router.post('/departments', DepartmentController.join);
router.put('/departments/:id', DepartmentController.edition);
router.delete('/departments/:id', DepartmentController.remove);

module.exports = router;