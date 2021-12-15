const mongoose = require('mongoose');
const transactions = require('./transaction');
const Schema = mongoose.Schema;

const BudgetSchema = new Schema({
    name: String,
    netIncome: {
        type: Number,
        min: 0,
        default: 0
    },
    budgetedExpenses: {
        type: Number,
        min: 0,
        default: 0
    },
    totalExpenses: {
        type: Number,
        min: 0,
        default: 0
    },
    totalSavings: {
        type: Number,
        min: 0,
        default: 0
    },
    balance: {
        type: Number,
        default: 0
    },
    transactions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Transaction'
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

BudgetSchema.pre('save', function(next) {
    if(next) {
        this.balance = this.netIncome - this.totalExpenses - this.totalSavings;
    }
    next();
});

BudgetSchema.post('findOneAndDelete', async function(doc) {
    if(doc) {
        await transactions.deleteMany({
            _id: {
                $in: doc.transactions
            }
        })
    }
});

module.exports = mongoose.model('Budget',BudgetSchema);