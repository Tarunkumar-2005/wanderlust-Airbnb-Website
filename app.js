if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}

const dns = require('dns');
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const express =require('express');
const app = express();
const mongoose = require('mongoose')
const Listing = require("./models/listing.js")
const path = require('path');
const methodoverride= require('method-override');
const ejsMate= require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride('_method'));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public"))); 

const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";
const LOCAL_DB_URL = "mongodb://127.0.0.1:27017/wanderlust";

let activeDbUrl = dbUrl;

main().then(()=>{
    console.log("mongodb connected");
}).catch((err)=>{ 
    console.log("MongoDB connection error:", err.message);
});

async function main(){
    try {
        await mongoose.connect(dbUrl, { serverSelectionTimeoutMS: 5000 });
    } catch (err) {
        console.warn("Could not connect to Atlas DB, falling back to local MongoDB...");
        activeDbUrl = LOCAL_DB_URL;
        await mongoose.connect(LOCAL_DB_URL);
    }
};

const store = MongoStore.create(
    {
        mongoUrl: process.env.ATLASDB_URL ? LOCAL_DB_URL : dbUrl,
        crypto:{
            secret:process.env.SECRET || "defaultsecret",
        },
        touchAfter: 24 * 60 * 60  //in seconds
    }
);

store.on("error",()=>{
    console.log("Error in MONGO SESSION STORE");
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        HttpOnly:true,
    }
}


app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currUser=req.user || null;
    next();
})


const wrapAsync = require('./utils/wrapAsync.js');
const listingController = require('./controllers/listings.js');
const { isLoggedIn } = require('./middleware.js');

app.get('/', wrapAsync(listingController.index));
app.get('/dashboard', isLoggedIn, wrapAsync(listingController.renderDashboard));

app.use('/listings',listingRouter);
app.use('/listings/:id/reviews',reviewRouter);
app.use('/',userRouter);

app.use((req, res, next) => {
    res.status(404).render('error.ejs',{message:"Page Not Found"});
});
//middleware
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render('error.ejs',{message});
});


app.listen(3000,()=>{
    console.log("server listening at port 3000");
});