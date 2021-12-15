const Transaction = require('../models/transaction');
const Budget = require('../models/budget');

module.exports.createTransaction = async (req, res) => {
    const budget = await Budget.findById(req.params.id);
    const transaction = new Transaction(req.body.transaction);
    budget.transactions.push(transaction);

    if(transaction.type === 'Income'){
        budget.netIncome += transaction.amount;
    }
    else if(transaction.type === 'Expense'){
        budget.totalExpenses += transaction.amount;
    }
    else {
        budget.totalSavings += transaction.amount;
    }
    
    await transaction.save();
    await budget.save();
    req.flash('success','Addedd new transaction!');
    res.redirect(`/budgets/${budget._id}`);
};

module.exports.deleteTransaction = async (req, res) => {
    const { id, transactionId } = req.params;
    const budget = await Budget.findByIdAndUpdate(id, {$pull: { transactions: transactionId }});
    const t = await Transaction.findById(transactionId);
    switch (t.type) {
        case 'Expense':
            budget.totalExpenses -= t.amount
            break;
        case 'Income':
            budget.netIncome -= t.amount;
            break;
        case 'Savings':
            budget.totalSavings -= t.amount;
            break;
    }
    await budget.save();
    await t.delete();
    res.redirect(`/budgets/${id}`);
};