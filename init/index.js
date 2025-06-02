const mongoose = require("mongoose");

const initdata = require("./data.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

main().then(()=>{
    console.log("connected to database");
}).catch((error)=>{console.log(error)});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}


const initDB = async()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj, owner:'682d801c7cd87a142d4e866f'}));
    await Listing.insertMany(initdata.data);
    console.log("data is initialized");

};
initDB();


