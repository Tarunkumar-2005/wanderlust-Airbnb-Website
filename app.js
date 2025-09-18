const express =require('express');
const app = express();
const mongoose = require('mongoose')
const Listing = require("./models/listing.js")
const path = require('path');
const methodoverride= require('method-override');
const ejsMate= require('ejs-mate');
const session = require('express-session');
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
const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("mongodb connected");
}).catch((err)=>{ 
    console.log(err);
});

async function main(){
    await mongoose.connect(mongo_url);
};

const sessionOptions={
    secret:"hi123456789Tarun",
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
    res.locals.currUser=req.user;
    next();
})

app.get('/',async (req,res)=>{
    // const allListings = await Listing.find();
    // res.render('listings/index.ejs',{allListings});
    res.send("Home Page");
})

app.use('/listings',listingRouter);
app.use('/listings/:id/reviews',reviewRouter);
app.use('/',userRouter);

app.use((req, res, next) => {
    res.status(404).render('error.ejs',{message:"Page Not Found"});
});
//middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render('error.ejs',{message});
});

app.listen(3000,()=>{
    console.log("server listening at port 3000");
});











