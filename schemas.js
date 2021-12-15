const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html')

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                });
                if (clean !== value) 
                    return helpers.error ('string.escapeHTML', { value });
                
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.transactionSchema = Joi.object({
    transaction: Joi.object({
        description: Joi.string().required().escapeHTML(),
        type: Joi.string().valid('Expense', 'Income', 'Savings'),
        category: Joi.string().valid( 'Bonus', 'Clothing', 'Communications', 'Debt', 'Education', 'Emergency fund', 'Entertainment', 'Fees', 'Food', 'Gifts and donations', 'Housing', 'Insurance', 'Investing', 'Medical', 'Personal', 'Pets', 'Recreation', 'Salary', 'Transportation' ),
        date: Joi.date().iso(),
        amount: Joi.number().required().min(0)
    }).required()
});

module.exports.budgetSchema = Joi.object({
    budget: Joi.object({
        name: Joi.string().required().escapeHTML(),
        netIncome: Joi.number(),
        budgetedExpenses: Joi.number(),
        totalExpenses: Joi.number(),
        totalSavings: Joi.number(), 
        allocatable: Joi.number()
    }).required()
});