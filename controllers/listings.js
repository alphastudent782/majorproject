const Listing = require("../models/listing");


//Index route
module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("index.ejs", { allListings });
};
//New Route
module.exports.renderNewForm = (req,res)=>{
    res.render("new.ejs");
};
//Show route
module.exports.show = async(req,res)=>{
    let { id }=req.params;
    const listing = await Listing.findById(id)
        .populate({
            path:"reviews",
            populate: {
                path:"author"
            },
        })   
        .populate("owner");
    if(!listing){
        req.flash("error", "listing does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("show.ejs", { listing });

};
// Create route
module.exports.create = async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = { url , filename};
    await newlisting.save();
    req.flash("success","New Listing added successfully!");
    res.redirect("/listings");
    
};
//Edit route
module.exports.edit = async(req,res)=>{
    let { id }= req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listing you requested does not exist!");
        res.redirect('/listings');
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("edit.ejs", { listing , originalImageUrl });
};
//Update Route
module.exports.update = async(req,res)=>{
    
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url , filename};
    await listing.save();
    }
    

    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${ id }`);
};
//Delete route
module.exports.delete = async(req,res)=>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing deleted!");
    res.redirect("/listings");
};