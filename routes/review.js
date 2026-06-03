const express=require("express");
const router=express.Router({mergeParams:true});
const {reviewSchema}=require("../schema.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {isLoggedin, validateReview, isAuthor}=require("../middleware.js");
const reviewController=require("../controllers/review.js");

router.post("/",isLoggedin, validateReview, wrapAsync(reviewController.reviewSubmit));

router.delete("/:reviewId", isLoggedin,isAuthor, wrapAsync(reviewController.delete));

module.exports=router;   