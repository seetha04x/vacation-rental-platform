const mongoose=require("mongoose");
const indata=require("./data.js");
const Listing=require("../models/listing.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb")
}
main()
.then(()=>{
    console.log("connect to DB");
})
.catch((err)=>{
    console.log("error");
})
async function initDB(){
   // run this once in a script or Mongo shell
 await Listing.updateMany(
  { "geometry.coordinates": { $size: 0 } }, // only listings with empty coords
  {
    $set: {
      geometry: {
        type: "Point",
        coordinates: [77.0, 9.96] // fallback lon, lat
      }
    }
  }
);
 console.log("Geometry updated for listings with empty coordinates");
}
initDB();