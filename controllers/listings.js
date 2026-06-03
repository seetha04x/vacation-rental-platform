const listing=require("../models/listing.js");
const fetch = require("node-fetch");
const axios = require("axios");

//to display all listings 
module.exports.index=async (req,res)=>{
    const all=await listing.find({});
    if(all.length==0){
      return res.render("./listings/index.ejs", {all, message:"No listings available yet."});
    }
    res.render("./listings/index.ejs", {all});
};

//to create new listing
module.exports.newForm=(req,res)=>{      
        res.render("./listings/new.ejs");}

//to view individual listing        
module.exports.show=async (req,res)=>{
    const {id}=req.params;
    const list= await listing.findById(id).populate({path:"reviews", populate:{path:"owner"}}).populate("owner");
    // const list=await listing.findById(id);
    if (!list){
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    // const reviews=await review.find({_id: {$in: list.reviews} })
    // const reviews= list.reviews
    res.render("./listings/show.ejs", {list});
}     

//to post newly created listing
module.exports.newSubmit=async(req,res)=>{
    const {title,description, price, location, country}=req.body;
    const owner=req.user._id;
    const geoRes = await axios.get(
  "https://nominatim.openstreetmap.org/search",
  {
    params: {
      format: "json",
      q: location
    },
    headers: {
      "User-Agent": "AirBnb/1.0 (vrishchika2310@gmail.com)"
    }
  }
);
    const newListing= new listing({title, description, price, location, country, owner});
     if (geoRes.data.length > 0) {
    newListing.geometry = {
      type: "Point",
      coordinates: [
        parseFloat(geoRes.data[0].lon),
        parseFloat(geoRes.data[0].lat)
      ]
    };
  }
  else {
  // fallback coordinates (longitude, latitude)
  newListing.geometry = {
    type: "Point",
    coordinates: [77.0, 9.96] // e.g. Udumbanchola, Kerala
  };
}
    if (req.file){
        newListing.image={
            url:req.file.path,
            filename:req.file.filename,
        }
    }
    await newListing.save();
    req.flash("success","New Listing created!");
    res.redirect("/listings");
}

//to view edit form
module.exports.editForm=async (req,res)=>{
    const {id}= req.params;
    const list= await listing.findById(id);
    let originalImg=list.image.url;
    originalImg=originalImg.replace("upload/", "upload/h_300,w_250/");
    res.render("./listings/edit.ejs", {list,originalImg} );
}

//to post the edits
module.exports.editSubmit=async (req,res)=>{
    const {id}= req.params;
    const {title,description, price, location, country}=req.body;
    let newlisting=await listing.findByIdAndUpdate({_id:id}, {title,description, price, location, country});
    if (req.file){
        newlisting.image={
            url:req.file.path,
            filename:req.file.filename,
        }
    }
    await newlisting.save();
    req.flash("success","Listing updated!");
    res.redirect(`/listings/${id}`);
}

//to delete listing
module.exports.delete=async (req,res)=>{
    const {id}=req.params;
    await listing.findByIdAndDelete({_id:id});
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
}
module.exports.category=async (req,res)=>{
  const {category}=req.params;
  let all;
  if (category=="full"){
     all= await listing.find({});
  }
  else{
     all= await listing.find({category});
  }
  if (all.length==0){
    return res.render("./listings/index.ejs", {all, message:"No listings available in this category yet."});
  }
  res.render("./listings/index.ejs", {all});
}



