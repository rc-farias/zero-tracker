const Budget = require('./models/budget');
const Transaction = require('./models/transaction');

const { budgetSchema, transactionSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError')

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in!');
        return res.redirect('/login');
    }
    next();
};

module.exports.validateBudget = (req, res, next) => {
    const { error } = budgetSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
};

module.exports.validateTransaction = (req, res, next) => {
    const { error } = transactionSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
};

module.exports.isAuthorized = async(req, res, next) => {
    const {id} = req.params;
    const budget = await Budget.findById(id);

    if(!budget.owner.equals(req.user._id)){
        req.flash('error','You do not have permission to do that!!')
        return res.redirect(`/budgets/${budget._id}`);
    }
    next();
};