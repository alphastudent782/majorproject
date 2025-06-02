const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.validatelisting = (req,res,next)=>{
    let { error } = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }

};
module.exports.validatereview = (req,res,next)=>{
     let { error } = reviewSchema.validate(req.body);
     if (error) {
        let errMsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
     } else {
        next();
     }
 };


module.exports.isLoggedIn = (req,res, next)=>
    {
    // console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must login first!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{

if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl
}
next();
};


module.exports.isOwner = async (req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error","permission denied");
        return res.redirect(`/listings/${ id }`);
     }
     next();
};
module.exports.isAuthor = async (req,res,next)=>{
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","permission denied");
        return res.redirect(`/listings/${ id }`);
     }
     next();
};