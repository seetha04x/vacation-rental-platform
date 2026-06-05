const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const reviews= require("./review.js");
const listingSchema=new Schema({
    title:String,
    description:String,
    image:{
        url:String,
        filename:String,
        },
     price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"review",}],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"user",
    },
    geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
      default: [77.0, 9.96] 
    }
  },
  category:{
      type:String,
      required:true,
    }
});
listingSchema.post("findOneAndDelete", async(listing)=>{
    if (listing){
    await reviews.deleteMany({_id:{$in:listing.reviews}});} 
})
const listing= mongoose.model("listing", listingSchema);
module.exports= listing;