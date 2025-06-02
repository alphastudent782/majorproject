const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn,isAuthor, validatereview } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");
const review = require("../models/review.js");


// app.use("/listings", listings);

router.post("/",  isLoggedIn, validatereview, wrapAsync(reviewController.createReview));

// delete review route
router.delete("/:reviewId",isLoggedIn, isAuthor, wrapAsync(reviewController.destroyReview)
);

module.exports = router;