const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionType = [ 'Expense', 'Income', 'Savings']
const transactionCategory = [ 'Bonus', 'Clothing', 'Communications', 'Debt', 'Education', 'Emergency fund', 'Entertainment', 'Fees', 'Food', 
                            'Gifts and donations', 'Housing', 'Insurance', 'Investing', 'Medical', 'Personal', 'Pets', 'Recreation', 'Salary', 'Transportation' ];

const TransactionSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: transactionType,
        required: true
    },
    category: {
        type: String,
        enum: transactionCategory,
        required: true
    },
    date: Date,
    amount: {
        type: Number,
        min: 0,
        required: true

    }
});


module.exports = mongoose.model('Transaction',TransactionSchema);