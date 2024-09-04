if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const wrapAsync = require('./utils/wrapAsync.js');
const User = require("./models/user.js");
const Listing = require('./models/schema.js');
const { isLoggedIn } = require('./middleware.js');
const MongoStore = require('connect-mongo');
// Routes
const listings = require("./routes/listing.js");
const reviews = require('./routes/review.js');
const user = require("./routes/user.js");

const app = express();
const port = 8080;

// const Mongo_URL = "mongodb://127.0.0.1:27017/airbnb";
const db_URL = process.env.ATLASDB_URL;
// MongoDB connection
async function main() {
    await mongoose.connect(db_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Database connected");
}

main().catch(err => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // Exit if connection fails
});

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const store =MongoStore.create({
    mongoUrl:db_URL,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter: 24*3600,
});
store.on("error", ()=>{
    console.log("ERROR IN MONGO SESSION STORE");
})
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.deleted = req.flash("deleted");
    res.locals.edited = req.flash("edited");
    res.locals.rev = req.flash("rev");
    res.locals.del = req.flash("del");
    res.locals.currUsr = req.user;
    next();
});

app.get('/', (req, res) => {
    res.send("hello");
});

app.get('/demouser', async (req, res) => {
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "Mayank",
    });
    let registeredUser = await User.register(fakeUser, "helloworld");
    res.send(registeredUser);
});

app.use('/listings', listings);
app.use('/listings/:id/review', reviews);
app.use('/', user);

app.get('/home', wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    const category = req.query.category;
    const state = req.query.state;
    const userId = req.session.userId;
    res.render('listings/home', { allListings, category, state });
    console.log(userId);
}));

app.get('/my', isLoggedIn, wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    const category = req.query.category;
    const userId = req.session.userId;
    const state = req.query.state;
    res.render('listings/my', { allListings,category, userId ,state});
}));

app.all("*", (req, res, next) => {
    res.render('listings/error.ejs');
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render('listings/error2', { err });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
