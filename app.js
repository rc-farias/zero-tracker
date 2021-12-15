const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const morgan = require("morgan");
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const wrapAsync = require('./utils/wrapAsync');
const mongoSanitize = require('express-mongo-sanitize');
const userRoutes = require('./routes/users');
const budgetsRoutes = require('./routes/budgets');
const transactionsRoutes = require('./routes/transactions');
// const helmet = require('helmet');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/zero-tracker';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    // useCreateIndex: true 
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const secret = process.env.SECRET || 'arandomsecretisbetterthannosecret!';

const sessionConfig = {
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

const transactionTypes = [ 'Expense', 'Income', 'Savings']
const transactionCategories = [ 'Bonus', 'Clothing', 'Communications', 'Debt', 'Education', 'Emergency fund', 'Entertainment', 'Fees', 'Food', 
                            'Gifts and donations', 'Housing', 'Insurance', 'Investing', 'Medical', 'Personal', 'Pets', 'Recreation', 'Salary', 'Transportation' ];


app.use('/', userRoutes);
app.use('/budgets', budgetsRoutes);
app.use('/budgets/:id/transactions', transactionsRoutes);

app.get('/', (req,res) => {
    res.render('home');
});

app.all('*', (req,res,next) => {
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Something Went Wrong. Please Try Again.'
    res.status(statusCode).render('error', { err });
});

const port = process.env.PORT || 3030;
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});
