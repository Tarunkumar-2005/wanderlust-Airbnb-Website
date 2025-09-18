const Listing = require('../models/listing.js');
module.exports.index = async (req,res)=>{
    const allListings = await Listing.find();
    res.render('listings/index.ejs',{allListings});
};
module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};
module.exports.showListing = async (req,res)=>{
    let {id} =req.params;
    const list= await Listing.findById(id)
    .populate({path:"reviews",populate:{path:"author"}})
    .populate("owner");
    
    if(!list){
        req.flash("error","Cannot find that listing");
        return res.redirect('/listings');
        }
        res.render("listings/show.ejs",{list});
};
module.exports.createListing = async (req,res,next)=>{
    let listing = req.body.Listing; //another method to get the data from the form
    let newlisting = new Listing(listing);
    newlisting.owner=req.user._id;
    await newlisting.save();
    req.flash("success","new listing created!");
    res.redirect('/listings');
};
module.exports.renderEditForm = async (req,res)=>{
    let {id} =req.params;
    const list= await Listing.findById(id);
    if(!list){
        req.flash("error","Cannot find that listing");
        return res.redirect('/listings');
    }
    res.render('listings/edit.ejs',{list});
};
module.exports.updateListing = async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.Listing}); //also req.body.Listing
    req.flash("success","Listing updated");
    res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    
    let deletedList = await Listing.findByIdAndDelete(id);
    //console.log(deletedList);
    req.flash("success","Listing deleted");
    res.redirect('/listings');
};

