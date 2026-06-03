const listing=require("./models/listing.js");
const review=require("./models/review.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema, reviewSchema}=require("./schema.js");

function isLoggedin(req,res,next){
    if(!req.isAuthenticated()){
            req.session.redirectUrl=req.originalUrl;
            req.flash("error", "You must be logged in to create a listing!");
            return res.redirect("/login");}
    next();        
}

function saveRedirectUrl(req,res,next){
        if(req.session.redirectUrl){
            res.locals.redirectUrl=req.session.redirectUrl;
            delete req.session.redirectUrl
        }
        next();
}

async function isOwner(req,res,next){
    const {id}= req.params;
    const list= await listing.findById(id);
     if(!(res.locals.currUser.equals(list.owner))){
            req.flash("error", "You dont have the access!");
            return res.redirect(`/listings/${id}`);
        }
      next();  
}
async function isAuthor(req,res,next){
    const {id,reviewId}=req.params;
    let reviewReq= await review.findById(reviewId);
     if(!(res.locals.currUser.equals(reviewReq.owner))){
            req.flash("error", "You dont have the access!");
            return res.redirect(`/listings/${id}`);
        }
      next();  
}
const validateListing=(req,res,next)=>{
    let result=listingSchema.validate(req.body);
    if(result.error){
        let errMsg=result.error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg );
    }
    else{
        next();
    }}

const validateReview=(req,res,next)=>{
    let result=reviewSchema.validate(req.body);
    if(result.error){
        let errMsg=result.error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
 }  

module.exports={ isLoggedin,saveRedirectUrl, isOwner, isAuthor, validateListing, validateReview};
