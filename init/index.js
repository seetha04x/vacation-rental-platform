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
   await Listing.deleteMany({});
   indata.data = indata.data.map(el => 
    ({ ...el, owner: "69de60ba5320ff868722a277"})
);

    await Listing.insertMany(indata.data);

    console.log("data initialised")
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
    console.log("geomtery initialized");
}
initDB();