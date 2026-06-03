const mongoose=require("mongoose");
const schema=mongoose.Schema;

const reviewSchema=new schema({
    comment:{type: String,
        default:"No reviews yet",  
        required: true},
    rating:{
        default: 3,
        type: Number,
        min: 1,
        max: 5,
    },
    owner:{
        type:schema.Types.ObjectId,
        ref:"user",
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
})
const review= mongoose.model("review", reviewSchema);
module.exports= review;
