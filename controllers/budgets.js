const Budget = require('../models/budget');

const transactionTypes = [ 'Expense', 'Income', 'Savings']
const transactionCategories = [ 'Bonus', 'Emergency fund', 'Clothing', 'Communications', 'Debt', 'Education', 'Entertainment', 'Fees', 'Food', 'Gifts and donations', 
                                'Housing', 'Insurance', 'Investing', 'Medical', 'Personal', 'Pets', 'Recreation', 'Salary', 'Transportation' ];

module.exports.index = async (req,res) => {
    const budgets = await Budget.find({owner: req.user._id});
    res.render('budgets/index', {budgets});
};

module.exports.renderNewForm = (req,res) => {
    res.render('budgets/new')
};

module.exports.createBudget = async (req,res,next) => {
    const budget = new Budget(req.body.budget);
    budget.owner = req.user._id;
    await budget.save();
    req.flash('success', 'Successfully added a new budget!');
    res.redirect(`/budgets/${budget._id}`);
};

module.exports.showBudget = async (req,res) => {
    const budget = await Budget.findById(req.params.id).populate('transactions');   
    if(!budget){
        req.flash('error', 'Cannot find the budget!');
        res.redirect('/budgets');
    }
    res.render('budgets/show', {budget, transactionCategories, transactionTypes});
};

module.exports.renderEditForm = async (req,res) => {
    const budget = await Budget.findById(req.params.id);
    res.render('budgets/edit', {budget})
};

module.exports.updateBudget = async (req,res) => {
    const {id} = req.params;
    const budget = await Budget.findById(id);
    budget.name = req.body.budget.name;
    budget.netIncome = req.body.budget.netIncome;
    budget.budgetedExpenses = req.body.budget.budgetedExpenses;
    await budget.save();
    req.flash('success','Successfully updated budget!!')
    res.redirect(`/budgets/${budget._id}`);
};

module.exports.deleteBudget = async (req,res) => {
    const {id} = req.params;
    await Budget.findByIdAndDelete(id);
    res.redirect('/budgets');
};