const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const Budget = require('../models/budget');
const { transactionSchema } = require('../schemas.js');
const { validateTransaction, isLoggedIn } = require('../middleware');
const transactions = require('../controllers/transactions');

router.post('/', isLoggedIn, validateTransaction, wrapAsync(transactions.createTransaction));

router.delete('/:transactionId', isLoggedIn, wrapAsync(transactions.deleteTransaction));

module.exports = router;