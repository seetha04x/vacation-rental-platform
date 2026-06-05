const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const mongoose=require("mongoose");
const listing=require("../models/listing.js");
const {isLoggedin, isOwner, validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js")
const upload=multer({storage});

router.route("/")
//to display all listings
    .get(wrapAsync(listingController.index))
//to post new listing    
    .post(isLoggedin, upload.single("image"),validateListing, wrapAsync(listingController.newSubmit))

//to create new listing
router.get("/new", isLoggedin,listingController.newForm);

router.get("/search", wrapAsync(listingController.search));
//to get into edit page of listing
router.get("/:id/edit",isLoggedin,isOwner, wrapAsync(listingController.editForm))

router.route("/:id")
//to view individual listing
    .get(wrapAsync(listingController.show))
//to post the edits
    .put(isLoggedin, isOwner, upload.single("image"),validateListing, wrapAsync(listingController.editSubmit))
//to delete listing
    .delete(isLoggedin,isOwner, wrapAsync(listingController.delete));

router.get("/category/:category", wrapAsync(listingController.category));


module.exports=router;

