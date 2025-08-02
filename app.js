const express =require('express');
const app = express();
const mongoose = require('mongoose')
const Listing = require("./models/listing.js")
const path = require('path');
const methodoverride= require('method-override');
const ejsMate= require('ejs-mate');
const wrapAsync=require('./utils/wrapAsync.js');
const ExpressError= require('./utils/ExpressError.js');
const { wrap } = require('module');
const {listingSchema} = require('./schema.js');

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

app.get('/',async (req,res)=>{
    const allListings = await Listing.find();
    res.render('listings/index.ejs',{allListings});
})


// app.get('/testListing',wrapAsync( async (req,res)=>{
//     let sampleListing =new Listing({
//         title: "My New Villa",
//         description:"By the Beach",
//         price:1200,
//         location:"Calangute ,Goa",
//         country: "India"
//     });
//     await sampleListing.save();
//     console.log("sample saved");
//     res.send("success testing !");
// }));

const validateListing =(req,res,next)=>{
    const {error} = listingSchema.validate(req.body); //using Joi
    if (error) {
        
        const msg = error.details.map(el => el.message).join(',');
        
        throw new ExpressError(400, msg);
    }else{
        next();
    }
}

//index.ejs
app.get('/listings',wrapAsync( async (req,res)=>{
    const allListings = await Listing.find();
    res.render('listings/index.ejs',{allListings});
}));
//new route

app.get('/listings/new',(req,res)=>{
    res.render("listings/new.ejs");
});
//show route
app.get('/listings/:id',wrapAsync( async (req,res)=>{
    let {id} =req.params;
    const list= await Listing.findById(id);
    res.render("listings/show.ejs",{list});
}));
//create route
app.post('/listings',validateListing ,wrapAsync(async (req,res,next)=>{
    
    // if(!req.body.listing){      //not seeing individul field rather totally err
    //     throw new ExpressError(400,"send valid data for listing");
    // }
    let listing = req.body.Listing; //another method to get the data 
    // if(!listing.title){
    //     throw new ExpressError(400,"title is required");
    // }
    let newlisting = new Listing(listing);
    await newlisting.save();
    res.redirect('/listings');
})
);
//edit route
app.get('/listings/:id/edit',wrapAsync( async (req,res)=>{
    let {id} =req.params;
    const list= await Listing.findById(id);
    res.render('listings/edit.ejs',{list});
}));
//update route
app.put('/listings/:id',validateListing,wrapAsync( async (req,res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send valid data for listing");
    // }
    let {id}=req.params;
    
    await Listing.findByIdAndUpdate(id,{...req.body.Listing}); //also req.body.Listing
    res.redirect(`/listings/${id}`);
}));
//delete route
app.delete('/listings/:id',wrapAsync( async (req,res)=>{
    let {id} = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    //console.log(deletedList);
    res.redirect('/listings');
}));

// "Page Not Found" middleware for undefined routes
// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found!"));
// });

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











