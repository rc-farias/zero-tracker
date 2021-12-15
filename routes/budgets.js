const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const Budget = require('../models/budget');
const Transaction = require('../models/transaction');
const { budgetSchema } = require('../schemas.js')
const budgets = require('../controllers/budgets');
const { isLoggedIn, isAuthorized, validateBudget } = require('../middleware');

router.get('/', isLoggedIn, wrapAsync(budgets.index));

router.get('/new',  isLoggedIn, budgets.renderNewForm); 

router.post('/', isLoggedIn, validateBudget, wrapAsync(budgets.createBudget)); 

router.get('/:id', isLoggedIn, wrapAsync(budgets.showBudget));

router.get('/:id/edit', isLoggedIn, wrapAsync(budgets.renderEditForm));

router.put('/:id',  isLoggedIn, validateBudget, wrapAsync(budgets.updateBudget));

router.delete('/:id', isLoggedIn, wrapAsync(budgets.deleteBudget));

module.exports = router;