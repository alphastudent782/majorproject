 if(process.env.NODE_ENV != "production"){
     require('dotenv').config();
 }
const express = require("express");
const app = express();
const port = 10000;
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,  reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");
const user = require("./routes/user.js");



// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

 const dbURL = process.env.ATLASDB_URL;



main().then(()=>{console.log("connected to database")})
      .catch((error)=>{console.log(error)});


async function main(){
    await mongoose.connect(dbURL);
}

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);


const store = MongoStore.create({
    mongoUrl : dbURL,
    crypto:{
        secret:process.env.SECRET,
        
    },
    touchAfter: 24 * 3600,
});

store.on("error",()=>{
    console.log("error occurred in mongo session store, error");

});



const sessionOptions = ({
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
});







// app.get("/", (req,res)=>{
//     res.send("server connected");
// });




app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next)=>{
res.locals.success = req.flash("success");
res.locals.error = req.flash("error");
res.locals.currentUser = req.user;
next();
});

app.get("/demouser", async(req,res)=>{
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "deltaStudent",
    });
    let registeredUser = await User.register(fakeUser, "helloworld");  //helloworld here is password
    res.send(registeredUser);
});













// const validatelisting = (req,res,next)=>{
//     let { error } = listingSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el)=> el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else{
//         next();
//     }

// };
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", user);


//

// app.get("/listings", wrapAsync(async(req,res)=>{
//     const allListings = await Listing.find({});
//     res.render("index.ejs", { allListings });
// }));
// app.get("/listings/new", (req,res)=>{
//     res.render("new.ejs");
// });


// app.get("/listings/:id", wrapAsync(async(req,res)=>{
//     let { id }=req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     res.render("show.ejs", { listing });
// }));
// app.post("/listings", validatelisting, wrapAsync(async(req,res,next)=>{
    
//     const newlisting = new Listing(req.body.listing);
//     await newlisting.save();
//     res.redirect("/listings");
    
// })
// );


// app.get("/listings/:id/edit", wrapAsync(async(req,res)=>{
//     let { id }= req.params;
//     const listing = await Listing.findById(id);
//     res.render("edit.ejs", { listing });
// }));
// app.put("/listings/:id",validatelisting , wrapAsync( async(req,res)=>{
    
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${ id }`);
// }));

// app.post("/listings/:id/reviews", validatereview, wrapAsync(async (req,res)=> {
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review (req.body.review);
//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();
//     // res.send("new review saved");
//     res.redirect(`/listings/${listing._id}`);
// }));

// // delete review route
// app.delete("/listings/:id/reviews/:reviewId", wrapAsync (async(req,res)=>{
//     let { id, reviewId } = req.params;
//     await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`);
// })
// );





// app.delete("/listings/:id",wrapAsync( async(req,res)=>{
//     let {id} = req.params;
//     await Listing.findByIdAndDelete(id);
//     res.redirect("/listings");
// }));
// // app.all('*', (req,res, next) => {
// //     next(new ExpressError(404,"Page NOT FOUND"));
// });
app.use((err,req,res,next) => {
    let { status = 400, message="something went wrong" } = err;
    // res.status(status).send(message);
    res.render("error.ejs", {message});

    
});








 
// app.get("/testlisting", async (req,res)=>{

// const newListing = new Listing({
//     title: "My New Villa",
//     description: "By the Beach",
//     price: 1200,
//     location: "Calangute , Goa",
//     country: "India"
// });
// await newListing.save();
// console.log("new sample saved");
// res.send("testing successfull");
// });

 app.listen(port,()=>{
    console.log(`listening on port ${port}`);
 });