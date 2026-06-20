if (process.env.NODE_ENV!="production"){
    require("dotenv").config({ path: "../.env" });
}
const mongoose=require("mongoose");
const indata=require("./data.js");
const Listing=require("../models/listing.js");
const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/airbnb";
console.log("dbUrl:", dbUrl);
async function main(){
    await mongoose.connect(dbUrl)
}
main()
.then(()=>{
    console.log("connect to DB");
    return initDB();
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