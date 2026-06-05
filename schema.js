const joi =require("joi");
const { createIndexes } = require("./models/listing");
const listingSchema=joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    price: joi.number().required().min(0),
    location: joi.string().required(),
    country: joi.string().required(),
    category: joi.string().required(),
    image: joi.string().allow("",null),
});

const reviewSchema=joi.object({
    comment:joi.string().required(),
    rating:joi.number().required().min(1).max(5),
    createAt:joi.date(),
})
module.exports={listingSchema, reviewSchema}; 
// to validate schema for listing and review