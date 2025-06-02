const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");

const { isLoggedIn, validatelisting } = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const listingController = require('../controllers/listings.js');
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


router
.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn, 
    validatelisting,
    upload.single('listing[image]'), 
    wrapAsync(listingController.create)
);


// /New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);


router
.route("/:id")
.get(wrapAsync(listingController.show))
.put(validatelisting ,isLoggedIn,upload.single('listing[image]'), isOwner, wrapAsync( listingController.update))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.delete) );


//Edit Route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.edit));







// //Index Route
// router.get("/", wrapAsync(listingController.index));
// ;

// //Show Route
// router.get("/:id", wrapAsync(listingController.show)
// );

// //Create Route
// router.post("/", isLoggedIn, validatelisting, wrapAsync(listingController.create)
// );



// //Update Route
// router.put("/:id",validatelisting ,isLoggedIn, isOwner, wrapAsync( listingController.update)
// );

// //Delete Route
// router.delete("/:id",isLoggedIn, isOwner, wrapAsync(listingController.delete) );
module.exports = router;