const review=require("../models/review.js");
const listing=require("../models/listing.js");

//to submit review
module.exports.reviewSubmit=async (req,res)=>{
    const {id}=req.params;
    const list=await listing.findById(id);
    const {comment, rating}=req.body;
    const owner=req.user._id;
    console.log(owner);
    let newReview = new review({comment, rating, owner });
    await newReview.save();
    list.reviews.push(newReview);
    await list.save();
    req.flash("success","Review added!");
    res.redirect(`/listings/${id}`);
}

//to delete review
module.exports.delete=async (req,res)=>{
    const {id, reviewId}=req.params;
    let reviewReq= await review.findById(reviewId);
    await review.deleteOne({_id:reviewId});
    await listing.updateOne({_id:id}, {$pull: {reviews:reviewId}})
    req.flash("success","Review deleted!");
    res.redirect(`/listings/${id}`);}